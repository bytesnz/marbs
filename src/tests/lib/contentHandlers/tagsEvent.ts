import * as ava from 'ava';

import { ContentHandlerCreator } from '../../../../typings/handlers';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../data/source';

import { getReturn } from '../asyncValue';
import { calculateTagsCount } from './tags';

export const tagsEventTests = (test: ava.RegisterContextual<any>, contentHandlerCreator: ContentHandlerCreator) => {
  test('tags event handler returns undefined if tags are not enabled', async (t) => {
    t.plan(2);

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    return new Promise((resolve, reject) => {
      contentHandler.events.tags({
        emit: (event: string, data: any) => {
          t.is('tags', event);
          t.deepEqual({
            results: undefined
          }, data);
          resolve();
        }
      });
    });
  });

  test('tags event handler returns the tags count if tags are enabled', async (t) => {
    t.plan(2);

    const conf = t.context.conf.clone();
    conf.set('functionality', {
      ...conf.get('functionality'),
      tags: true
    });
    const contentHandler = await getReturn(contentHandlerCreator(conf));

    return new Promise((resolve, reject) => {
      contentHandler.events.tags({
        emit: (event: string, data: any) => {
          t.is('tags', event);
          t.deepEqual({
            results: calculateTagsCount(testData.nulledTestDocuments.filter((doc) =>
        !doc.attributes.draft))
          }, data);
          resolve();
        }
      });
    });
  });
};
