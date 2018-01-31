import test from 'ava';

import { contentHandlerCreatorTests } from '../../tests/lib/contentHandlers';

import { contentHandlerCreator } from './content';

contentHandlerCreatorTests(test, contentHandlerCreator);
