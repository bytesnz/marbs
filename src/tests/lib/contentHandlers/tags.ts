import { Document, Tags } from '../../../../typings/data';
import { ContentHandlerCreator } from '../../../../typings/handlers';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../data/source';

import { getReturn } from '../asyncValue';

export const calculateTagsCount = 
    (documents: Array<Document>): Tags => documents.reduce((tagCounts, doc) => {
  if (doc.attributes.tags) {
    doc.attributes.tags.forEach((tag) => {
      if (typeof tagCounts[tag] === 'undefined') {
        tagCounts[tag] = 1;
      } else {
        tagCounts[tag]++;
      }
    });
  }

  return tagCounts;
}, {});

export const tagsTests = (test, contentHandlerCreator: ContentHandlerCreator) => {
  test ('tags() returns undefined if tags not enabled', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const tags = await contentHandler.tags();

    t.is(undefined, tags);
  });
  test('tags() returns the tags and counts when tags enabled', async (t) => {
    const conf = t.context.conf.clone();
    conf.set('functionality', {
      tags: true
    });
    const contentHandler = await getReturn(contentHandlerCreator(conf));

    const tags = await contentHandler.tags();

    const testTagsCount =
        calculateTagsCount(testData.nulledTestDocuments.filter((doc) =>
        !doc.attributes.draft));

    t.deepEqual(testTagsCount, tags);
  });
};
