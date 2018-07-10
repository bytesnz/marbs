import * as RST from 'remarkably-simple-tags';

import config from '../../app/lib/config';
import * as urlJoin from 'join-path';

// TODO Can these be hooked up to the state?

export const post: RST.TagHandler = (id: string) => {
  if (!id) {
    return;
  }

  return urlJoin(config.baseUri, id);
};

export const tags: RST.TagHandler = (tag: string) => {
  if (!tag) {
    return urlJoin(config.baseUri, config.tagsUri);
  }

  return urlJoin(config.baseUri, config.tagsUri + '#' + tag);
};

export const categories: RST.TagHandler = (category?: string) => {
  if (!category) {
    return urlJoin(config.baseUri, config.tagsUri);
  }

  if (config.categoriesPerPage) {
    return urlJoin(config.baseUri, config.tagsUri, category);
  } else {
    return urlJoin(config.baseUri, config.tagsUri + '#' + category);
  }
};

export const asset: RST.TagHandler = (assetUri: string) => {
  return urlJoin(config.baseUri, config.staticUri, assetUri);
};
