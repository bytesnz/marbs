import * as Configs from '../../../typings/configs';

import test from 'ava'

require('node-require-alias').setAlias({
  Config: '../config.global.js'
});

import { vol } from '../../tests/lib/unionfs';

import { handlerCreator } from './media';

import * as testData from '../../tests/data/source';
import {
  createDocument
} from '../../tests/data/source';
import { getReturn } from '../../tests/lib/asyncValue';

import * as path from 'path';
// Import unioned fs
import * as fs from 'fs';

import * as md5 from 'md5';

import * as sinon from 'sinon';

const testFileHashes = {
  'image.png': md5('image.png'),
  'image2.png': md5('image2.png'),
  'dir/image.png': md5('dir/image.png'),
  'dir/subdir/image.png': md5('dir/subdir/image.png'),
  '': md5(''),
  'dir': md5('dir'),
  'dir/subdir': md5('dir/subdir')
};

const mediaCollection = {
  id: testFileHashes[''],
  path: '',
  subGalleries: {
    [testFileHashes['dir']]: {
      id: testFileHashes['dir'],
      path: 'dir',
      subGalleries: {
        [testFileHashes['dir/subdir']]: {
          id: testFileHashes['dir/subdir'],
          path: 'dir/subdir',
          subGalleries: {},
          media: {
            [testFileHashes['dir/subdir/image.png']]: {
              width: 9,
              height: 9,
              type: 'png',
              id: testFileHashes['dir/subdir/image.png'],
              path: 'dir/subdir/image.png',
              gallery: testFileHashes['dir/subdir']
            }
          }
        }
      },
      media: {
        [testFileHashes['dir/image.png']]: {
          width: 9,
          height: 9,
          type: 'png',
          id: testFileHashes['dir/image.png'],
          path: 'dir/image.png',
          gallery: testFileHashes['dir']
        }
      }
    }
  },
  media: {
    [testFileHashes['image.png']]: {
      width: 9,
      height: 9,
      type: 'png',
      id: testFileHashes['image.png'],
      path: 'image.png',
      gallery: testFileHashes['']
    },
    [testFileHashes['image2.png']]: {
      width: 9,
      height: 9,
      type: 'png',
      id: testFileHashes['image2.png'],
      path: 'image2.png',
      gallery: testFileHashes['']
    }
  }
};

const media = {
  ...mediaCollection.media,
  ...mediaCollection.subGalleries[testFileHashes['dir']].media,
  ...mediaCollection.subGalleries[testFileHashes['dir']].subGalleries[testFileHashes['dir/subdir']].media
};

const testConf: Configs.ServerConfig = {
  title: 'Test Site',
  baseUri: '/',
  address: '127.0.0.1',
  port: 4321,
  source: '/source',
  functionality: {},
  draftRegex: '\\.draft$',
  disableFileWatch: true
};



let count = 0;

test.beforeEach((t) => {
  const mockBase = `/${process.pid}-${count++}`;
  const mockBaseAssets = `${mockBase}/static`

  const testConfig = Object.assign({}, testConf, {
    staticAssets: mockBaseAssets
  });

  // Copy test image into test filesystem
  const image = fs.readFileSync(path.resolve(__dirname, '../../tests/data/image.png'));

  vol.mkdirSync(mockBase);
  vol.mkdirSync(mockBaseAssets);
  vol.mkdirSync(path.join(mockBaseAssets, 'dir'));
  vol.mkdirSync(path.join(mockBaseAssets, 'dir/subdir'));
  vol.writeFileSync(path.join(mockBaseAssets, 'image.png'), image);
  vol.writeFileSync(path.join(mockBaseAssets, 'image2.png'), image);
  vol.writeFileSync(path.join(mockBaseAssets, 'dir/image.png'), image);
  vol.writeFileSync(path.join(mockBaseAssets, 'dir/subdir/image.png'), image);

  t.context.config = testConfig;
});

test('that the creator populates the media database', async (t) => {
  const handler = await handlerCreator(t.context.config);

  t.deepEqual(media, handler.media);

  t.deepEqual(mediaCollection, handler.galleries);
});

test('that the media event handler returns only media that is in the given directory', async (t) => {
  const handler = await handlerCreator(t.context.config);

  const id = 1;

  handler.events.media({
    emit: (type, data) => {
      t.deepEqual(Object.values(mediaCollection.media).map((media) => ({
          id: media.id,
          type: media.type,
          width: media.width,
          height: media.height
        })), data.media);
      t.deepEqual(id, data.id);
    }
  }, {
    id,
    filter: {
      ids: [ mediaCollection.id ]
    }
  });
});

test('media event handler returns media from galleries and sub galleries when subdirectories set', async (t) => {
  const handler = await handlerCreator(t.context.config);

  const id = 1;

  handler.events.media({
    emit: (type, data) => {
      t.deepEqual([
        ...Object.values(mediaCollection.subGalleries[testFileHashes['dir']].media),
        ...Object.values(mediaCollection.subGalleries[testFileHashes['dir']].subGalleries[testFileHashes['dir/subdir']].media)
      ].map((media) => ({
        id: media.id,
        type: media.type,
        width: media.width,
        height: media.height
      })), data.media);
      t.deepEqual(id, data.id);
    }
  }, {
    id,
    filter: {
      subGalleries: true,
      ids: [ testFileHashes['dir'] ]
    }
  });
});

test('media path handler returns the requested image from image uri', async (t) => {
  const handler = await handlerCreator(t.context.config);

  const res: any = {};

  res.sendFile = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  res.end = sinon.stub().returns(res);

  handler.paths.get['/:id']({
    params: {
      id: 'dir/image.png'
    }
  }, res);

  t.is(1, res.sendFile.callCount, 'sendFile not called');
  t.is(path.join(t.context.config.staticAssets, 'dir/image.png'), res.sendFile.getCall(0).args[0], 'sent file not image');
});

test('media path handler returns the requested image from md5 hash', async (t) => {
  const handler = await handlerCreator(t.context.config);

  const res: any = {};

  res.sendFile = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  res.end = sinon.stub().returns(res);

  handler.paths.get['/:id']({
    params: {
      id: testFileHashes['image.png']
    }
  }, res);

  t.is(1, res.sendFile.callCount, 'sendFile not called');
  t.is(path.join(t.context.config.staticAssets, 'image.png'), res.sendFile.getCall(0).args[0], 'sent file not image');
});
