import { ContentHandlerCreator } from '../../../../typings/handlers';
//TODO Add test type def import * as AVA from 'ava';
import * as testData from '../../data/source';

import { getReturn } from '../asyncValue';

export const documentsEventTests = (test, contentHandlerCreator: ContentHandlerCreator) => {
  test('documents event handler returns the only posts without drafts', async (t) => {
    t.plan(2);

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    return new Promise((resolve, reject) => {
      contentHandler.events.documents({
        emit: (event, data) => {
          t.is('documents', event);
          t.deepEqual({
            results: [
              testData.mappedDocuments[1],
              testData.mappedDocuments[3],
              testData.mappedDocuments[4],
              testData.mappedDocuments[5]
            ],
            start: 0,
            total: 4
          }, data);
          resolve();
        }
      }, {
        includeDrafts: true
      });
    });
  });

  test('documents event handler returns the posts with no options', async (t) => {
    t.plan(2);

    const contentHandler = await getReturn(contentHandlerCreator(t.context.conf));

    return new Promise((resolve, reject) => {
      contentHandler.events.documents({
        emit: (event, data) => {
          t.is('documents', event);
          t.deepEqual({
            results: [
              testData.mappedDocuments[1],
              testData.mappedDocuments[3],
              testData.mappedDocuments[4],
              testData.mappedDocuments[5]
            ],
            start: 0,
            total: 4
          }, data);
          resolve();
        }
      });
    });
  });

  test.todo('documents event handler returns documents with the given fields');
};
