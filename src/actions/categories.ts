import { Categories } from '../../typings/data';

export const MARSS_CATEGORIES_SET = 'MARSS_CATEGORIES_SET';

/**
 * Create a set categories action object
 *
 * @param newCategories Categories count to set as new categories count
 *
 * @returns Set Categories action
 */
export const setCategories = (newCategories: Categories) => ({
  type: MARSS_CATEGORIES_SET,
  data: newCategories
});
