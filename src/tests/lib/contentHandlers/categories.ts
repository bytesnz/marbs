import { ContentHandlerCreator } from '../../../../typings/handlers';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../data/source';
import { Tags } from 'tag-you-are';

import { getReturn } from '../asyncValue';

export const categoriesTests = (test, contentHandlerCreator: ContentHandlerCreator) => {
  test ('categories() returns undefined if categories no enabled', async (t) => {
    const contentHandler = await getReturn(contentHandlerCreator(t.context.config));

    const categories = await contentHandler.categories();

    t.is(undefined, categories);
  });

  test('categories() returns the categories and counts', async (t) => {
    const conf = {
      ...t.context.config,
      functionality: {
        ...t.context.config.functionality,
        categories: true
      }
    };
    const contentHandler = await getReturn(contentHandlerCreator(conf));

    const categories = await contentHandler.categories();

    const testCategoriesCount = new Tags('/');

    testData.nulledTestDocuments.filter((doc) =>
        !doc.attributes.draft).forEach((doc) => {
      if (doc.attributes.categories) {
        doc.attributes.categories.forEach((category) =>
            testCategoriesCount.add(category));
      }
    });

    t.deepEqual(testCategoriesCount.tags(), categories);
  });
};
