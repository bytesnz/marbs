import * as Configs from '../../../typings/configs';

import test from 'ava';

import { contentHandlerCreatorTests } from '../../tests/lib/contentHandlers';

import { contentHandlerCreator } from './content';

import { testSource, testDocuments } from '../../tests/data/source';

import { vol } from '../../tests/lib/unionfs';

const testConf: Configs.ServerConfig = {
  title: 'Test Site',
  baseUri: '/',
  address: '127.0.0.1',
  port: 4321,
  source: '/source',
  functionality: {},
  draftRegex: '\\.draft$'
};

test.beforeEach((t) => {
  const mockBase = `/${process.pid}`;
  const mockBaseSource = `${mockBase}/source`
  //const vol = new Volume();

  const testConfig = Object.assign({}, testConf, {
    source: mockBaseSource
  });

  vol.fromJSON(testSource, testConfig.source);

  t.context.config = testConfig;
});

contentHandlerCreatorTests(test, contentHandlerCreator);
