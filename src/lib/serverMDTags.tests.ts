import test from 'ava';

import serverMDTags from './serverMDTags';
import defaultServerConfig from './defaults/config.server'

import { SetServerConfig } from '../../typings/configs';

const config: SetServerConfig = {
  ...defaultServerConfig,
  serverTags: {
    test: (attributes) => `TAG(${attributes})`,
    test2: (attributes) => `TAG2(${attributes})`
  }
};

test('serverMDTags() removes tags that are unknown', (t) => {
  const serverTags = serverMDTags(config);
  t.is('before  after', serverTags.serverMDTags('before {%unknown%} after'));
});

test('serverMDTags() unescapes escaped tags', (t) => {
  const serverTags = serverMDTags(config);
  t.is('before {%test%} after', serverTags.serverMDTags('before {{%test%}} after'));
});

test('serverMDTags() replaces tags with output from tag handler functions', (t) => {
  const serverTags = serverMDTags(config);
  t.is('before TAG(attr) after', serverTags.serverMDTags('before {%test attr%} after'), 'tag');
  t.is('TAG(attr) after', serverTags.serverMDTags('{% test attr%} after'), 'tag at start with space before tag');
  t.is('TAG(undefined) after', serverTags.serverMDTags('{%test%} after'), 'tag at end with no attributes');
  t.is('before TAG(attr)', serverTags.serverMDTags('before {%test attr%}'), 'tag at end');
  t.is('before TAG2(attr,again again) after',
       serverTags.serverMDTags('before {%test2 attr "again again"%} after'), 'second tag with quoted attributes');
});
