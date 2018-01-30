import { ContentHandlerCreator } from '../../../../typings/handlers';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../data/source';

import { getReturn } from '../asyncValue';

export const getTests = (test, contentHandlerCreator: ContentHandlerCreator) => {
  test('get() returns undefined when a document does not exist for the given id', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const content = await contentHandler.get('');

    t.is(undefined, content);
  });

  test('get() returns the entire document when a good is given', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const content = await contentHandler.get(testData.testDocuments[0].id);

    t.deepEqual(testData.testDocuments[0], content);
  });

  test('get() returns draft content if requested', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const content = await contentHandler.get(testData.flaggedTestDocuments[2].id);

    t.deepEqual(testData.flaggedTestDocuments[2], content);
  });
};

