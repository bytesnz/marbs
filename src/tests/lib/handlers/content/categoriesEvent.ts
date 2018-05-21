import { ContentHandlerCreator } from '../../../../../typings/handlers';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../../data/source';

import { getReturn } from '../../asyncValue';
import { Tags } from 'tag-you-are';

export const categoriesEventTests = (test, contentHandlerCreator: ContentHandlerCreator) => {
  test('categories event handler returns undefined if categories are not enabled', async (t) => {
    t.plan(2);

    const contentHandler = await getReturn(contentHandlerCreator(t.context.config));

    return new Promise((resolve, reject) => {
      contentHandler.events.categories({
        emit: (event, data) => {
          t.is('categories', event);
          t.deepEqual({
            results: undefined
          }, data);
          resolve();
        }
      });
    });
  });

  test('categories event handler returns the categories count if categories are enabled', async (t) => {
    t.plan(2);

    const conf = {
      ...t.context.config,
      functionality: {
        ...t.context.config.functionality,
        categories: true
      }
    };
    const contentHandler = await getReturn(contentHandlerCreator(conf));

    const testCategoriesCount = new Tags('/');

    testData.nulledTestDocuments.filter((doc) =>
        !doc.attributes.draft).forEach((doc) => {
      if (doc.attributes.categories) {
        doc.attributes.categories.forEach((category) =>
            testCategoriesCount.add(category));
      }
    });

    return new Promise((resolve, reject) => {
      contentHandler.events.categories({
        emit: (event, data) => {
          t.is('categories', event);
          t.deepEqual({
            results: testCategoriesCount.tags()
          }, data);
          resolve();
        }
      });
    });
  });
};
