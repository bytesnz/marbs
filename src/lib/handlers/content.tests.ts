import * as Configs from '../../../typings/configs';

import test from 'ava';

require('node-require-alias').setAlias({
  Config: '../config.global.js'
});

import { vol } from '../../tests/lib/unionfs';

import { contentHandlerCreatorTests } from '../../tests/lib/handlers/content';

import { contentHandlerCreator } from './content';

import * as testData from '../../tests/data/source';
import {
  createDocument
} from '../../tests/data/source';
import { getReturn } from '../../tests/lib/asyncValue';

import * as path from 'path';

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
  const mockBaseSource = `${mockBase}/source`

  const testConfig = Object.assign({}, testConf, {
    source: mockBaseSource
  });

  vol.fromJSON(testData.testSource, testConfig.source);

  t.context.config = testConfig;
});

contentHandlerCreatorTests(test, contentHandlerCreator);

test.failing('contentHandler watches for file changes (failing due to test watch issue)', async (t) => {
  const contentHandler = await getReturn(contentHandlerCreator({
    ...t.context.config,
    disableFileWatch: false
  }));

  vol.writeFileSync(path.join(t.context.config.source,
      testData.newTestDocuments[0].id + '.md'), createDocument(testData.newTestDocuments[0]));

  vol.unlinkSync(path.join(t.context.config.source, testData.testDocuments[5].id + '.md'));

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const docs = await contentHandler.documents();

      t.log('got docs', docs);

      t.deepEqual([
        testData.nulledTestDocuments[0],
        testData.nulledTestDocuments[1],
        testData.nulledTestDocuments[3],
        testData.nulledTestDocuments[4],
        testData.nulledTestDocuments[5],
        testData.nulledNewTestDocuments[0]
      ], docs);

      resolve()
    }, 2000);
  });
});
