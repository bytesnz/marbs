import { ContentHandlerCreator } from '../../../../typings/handlers';
import { Document } from '../../../../typings/data';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../data/source';

import { getReturn } from '../asyncValue';

export const contentEventTests = (test, contentHandlerCreator: ContentHandlerCreator) => {
  test('content event handler returns undefined if content with the given id does not exist', async (t) => {
    t.plan(2);

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    return new Promise((resolve, reject) => {
      contentHandler.events.content({
        emit: (event, data) => {
          t.is('content', event);
          t.deepEqual({
            results: undefined,
            uri: ''
          }, data);
          resolve();
        }
      }, '');
    });
  });

  test('content event handler returns the full document of the given id', async (t) => {
    t.plan(2);

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    return new Promise((resolve, reject) => {
      contentHandler.events.content({
        emit: (event, data) => {
          t.is('content', event);
          t.deepEqual({
            uri: testData.testDocuments[0].id,
            results: testData.testDocuments[0]
          }, data);
          resolve();
        }
      }, testData.testDocuments[0].id);
    });
  });

  test('content event handler returns the full document for draft document with the given id', async (t) => {
    t.plan(2);

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    return new Promise((resolve, reject) => {
      contentHandler.events.content({
        emit: (event, data) => {
          t.is('content', event);
          t.deepEqual({
            uri: testData.flaggedTestDocuments[2].id,
            results: testData.flaggedTestDocuments[2]
          }, data);
          resolve();
        }
      }, testData.flaggedTestDocuments[2].id);
    });
  });
};
