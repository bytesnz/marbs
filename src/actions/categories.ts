import { Categories } from '../../typings/data';
import { SetGlobalConfig } from '../../typings/configs';

export const MARSS_CATEGORIES_SET = 'MARSS_CATEGORIES_SET';

export const createCategoriesActions = ({ dispatch }, options: SetGlobalConfig) => {
  /**
   * Creates and dispatches a set categories action object
   *
   * @param newCategories Categories count to set as new categories count
   *
   * @returns Set Categories action
   */
  const setCategories = (newCategories: Categories) => {
    dispatch({
      type: MARSS_CATEGORIES_SET,
      data: newCategories
    });
  };

  /**
   * Creates and dispatches a tags error
   *
   * @param message Error message
   * @param code Error code
   */
  const categoriesError = (message: string, code: number) => {
    dispatch({
      type: MARSS_CATEGORIES_SET,
      error: {
        message,
        code
      }
    });
  };

  return {
    setCategories,
    categoriesError
  };
};
