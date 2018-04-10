import * as ava from 'ava';

import * as process from 'process';

import { getReturn } from '../asyncValue';

import { documentsTests } from './documents';
import { getTests } from './get';
import { tagsTests } from './tags';
import { categoriesTests } from './categories';
import { documentsEventTests } from './documentsEvent';
import { contentEventTests } from './contentEvent';
import { tagsEventTests } from './tagsEvent';
import { categoriesEventTests } from './categoriesEvent';

/**
 * Validates that the given object is a ContentHandler
 *
 * @param t Test
 * @param contentHandler Content handler to test
 */
const validateContentHandler = (t, contentHandler) => {
  if (typeof contentHandler !== 'object') {
    t.fail('Content handler is not an Object');
    return;
  }

  t.is(typeof contentHandler.documents, 'function', 'Content handler does not have a documents function');

  t.is(typeof contentHandler.get, 'function', 'Content handler does not have a get function');

  t.is(typeof contentHandler.tags, 'function', 'Content handler does not have a tags function');
  t.is(typeof contentHandler.categories, 'function', 'Content handler does not have a categories function');

  if (typeof contentHandler.events !== 'object') {
    t.fail('Content handler does not attach to any events');
  } else {
    t.is(typeof contentHandler.events.content, 'function', 'Content handler does not have a function to listen for `content` events');
    t.is(typeof contentHandler.events.tags, 'function', 'Content handler does not have a function to listen for `tags` events');
    t.is(typeof contentHandler.events.categories, 'function', 'Content handler does not have a function to listen for `categories` events');
    //TODOt.is(typeof contentHandler.events.search, 'function', 'Content handler does not have a function to listen for `` events');
  }
};


/**
 * Test runner for a ContentHandlerCreator
 */
export const contentHandlerCreatorTests = (test: ava.RegisterContextual<any>, contentHandlerCreator) => {
  test('the creator returns either a handler or a promise that resolves to a handler', async (t) => {
    const value = await getReturn(contentHandlerCreator(t.context.config));

    validateContentHandler(t, value);
  });

  documentsTests(test, contentHandlerCreator);
  getTests(test, contentHandlerCreator);
  tagsTests(test, contentHandlerCreator);
  categoriesTests(test, contentHandlerCreator);
  documentsEventTests(test, contentHandlerCreator);
  contentEventTests(test, contentHandlerCreator);
  tagsEventTests(test, contentHandlerCreator);
  categoriesEventTests(test, contentHandlerCreator);
};
