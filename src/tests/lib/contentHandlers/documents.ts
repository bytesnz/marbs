import { ContentHandlerCreator } from '../../../../typings/handlers';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../data/source';

import { getReturn } from '../asyncValue';

export const documentsTests = (test, contentHandlerCreator: ContentHandlerCreator) => {
  test('documents() returns documents without drafts by default', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents();

    t.deepEqual([
      testData.nulledTestDocuments[0],
      testData.nulledTestDocuments[1],
      testData.nulledTestDocuments[3],
      testData.nulledTestDocuments[4],
      testData.nulledTestDocuments[5]
    ], docs);
  });

  test('documents() returns documents without drafts by default, with a different draft regex', async (t) => {
    const regex = '\.anotherdraft$';
    const conf = t.context.conf.clone();
    conf.set('draftRegex', regex);
    const contentHandler = await getReturn(contentHandlerCreator(conf));

    const docs = await contentHandler.documents();

    const testDocuments =
        testData.nullDocumentBodies(testData.flagDraftDocuments(testData.testDocuments, regex));
    t.deepEqual([
      testDocuments[0],
      testDocuments[1],
      testDocuments[2],
      testDocuments[4],
      testDocuments[5]
    ], docs);
  });

  test('documents() returns documents with drafts if includeDrafts true', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      includeDrafts: true
    });

    t.deepEqual(testData.nulledTestDocuments, docs);
  });

  test('documents() returns only documents with the given tag', async (t) => {
    const tag = 'test';

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      tags: [tag]
    });

    t.deepEqual([
      testData.nulledTestDocuments[1],
      testData.nulledTestDocuments[4],
      testData.nulledTestDocuments[5]
    ], docs);
  });

  test('documents() returns only documents with any of the given tags', async (t) => {
    const tags = ['folder', 'test'];

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      tags: tags
    });

    t.deepEqual([
      testData.nulledTestDocuments[1],
      testData.nulledTestDocuments[4],
      testData.nulledTestDocuments[5]
    ], docs);
  });

  test('documents() returns only documents with all of the given tags', async (t) => {
    const tags = ['folder', 'test'];

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      tags: tags,
      allTags: true
    });

    t.deepEqual([
      testData.nulledTestDocuments[4]
    ], docs);
  });

  test('documents() returns only documents with the given category', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      categories: ['cool']
    });

    t.deepEqual([
      testData.nulledTestDocuments[1],
      testData.nulledTestDocuments[3]
    ], docs);
  });

  test('documents() returns only documents with the given category in an array', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      categories: [['cool']]
    });

    t.deepEqual([
      testData.nulledTestDocuments[1],
      testData.nulledTestDocuments[3]
    ], docs);
  });

  test('documents() returns only documents with any of the given categories', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      categories: ['cool', ['folder', 'test']]
    });

    t.deepEqual([
      testData.nulledTestDocuments[1],
      testData.nulledTestDocuments[3],
      testData.nulledTestDocuments[4]
    ], docs);
  });

  test('documents() returns only documents with all of the given categories', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      categories: [['cool'], 'folder'],
      includeDrafts: true,
      allCategories: true
    });

    t.deepEqual([
      testData.nulledTestDocuments[3]
    ], docs);
  });

  test('documents() returns only documents with the given category array', async (t) => {
    const category = ['folder', 'test'];

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    const docs = await contentHandler.documents({
      categories: [category]
    });

    t.deepEqual([
      testData.nulledTestDocuments[4]
    ], docs);
  });


  test.todo('documents() returns only documents with the given date');

  test.todo('documents() returns only documents within the given date range');

  test.todo('documents() only returns the given fields');
};
