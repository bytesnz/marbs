import { Tags } from '../../typings/data';
import { Action } from '../../typings/state';

export const MARSS_TAGS_SET = 'MARSS_TAGS_SET';

/**
 * Create a set tags action object
 *
 * @param newTags Tags count to set as new tags count
 *
 * @returns Set tags action
 */
export const setTags = (newTags: Tags): Action => ({
  type: MARSS_TAGS_SET,
  data: newTags
});
