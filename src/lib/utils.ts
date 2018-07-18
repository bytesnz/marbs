import * as urlJoin from 'join-path';

import { Document } from '../../typings/data';
import { config } from '../app/lib/config';

/**
 * Create the url for the given asset
 *
 * @param asset URI to asset
 *
 * @returns URL to asset
 */
export const assetUrl = (asset: string) => urlJoin(config.baseUri,
    config.staticUri, asset);

export const iderise = (tag: string): string => tag.toLowerCase().replace(' ', '_');

export const uniderise = (id: string): string => id.replace('_', ' ');

/**
 * Creates a label for the given category
 *
 * @param category Category to create label for
 *
 * @returns Category label
 */
export const categoryLabel = (category: string | Array<string>) =>
  Array.isArray(category) ? category.pop() : category;

/**
 * Create the url for the categories list, or a given category
 *
 * @param category Category to create url to
 *
 * @returns URL to categories list / category
 */
export const categoryUrl = (category?: string | Array<string>) => {
  if (category) {
    if (Array.isArray(category)) {
      category = category.pop();
    }
    category = iderise(category);
    return (config.categoriesPerPage ?
      urlJoin(config.baseUri, config.categoriesUri, category) :
      urlJoin(config.baseUri, config.categoriesUri + '#' + category)
    );
  }

  return urlJoin(config.baseUri, config.categoriesUri);
};

/**
 * Flatten an array of categories into an array of singular categories
 *
 * @param categories Categories array to flatten
 *
 * @returns Flattened categories array
 */
export const flattenCategories =
    (categories: Array<string | Array<string>>): Array<string> => {
  let flatCategories = [];

  categories.forEach((category: string | Array<string>) => {
    if (Array.isArray(category)) {
      category.forEach((subCategory) => {
        if (flatCategories.indexOf(subCategory) === -1) {
          flatCategories.push(subCategory);
        }
      });
    } else {
      if (flatCategories.indexOf(category) === -1) {
        flatCategories.push(category);
      }
    }
  });

  return flatCategories;
}
/**
 * Create a label for the given tag
 *
 * @param tag Tag to create the label for
 *
 * @returns Label
 */
export const tagLabel = (tag: string) => tag;

/**
 * Create the url for the tags list, or a given tag
 *
 * @param tag Tag to create url to
 *
 * @returns URL to tags list / tag
 */
export const tagUrl = (tag?: string) => tag ?
    urlJoin(config.baseUri, config.tagsUri + '#' + tag) :
    urlJoin(config.baseUri, config.tagsUri);

/**
 * Create the url for the given document
 *
 * @param document Document ID to create url to
 *
 * @returns URL to document
 */
export const documentUrl = (id?: string) => urlJoin(config.baseUri, id);

/**
 * Filters the given posts to only those that have one/all of the given tags
 *
 * @param posts Lists of posts to filter
 * @param tags List of tags to filter on
 * @param allTags Whether or not to require post has all given tags
 *
 * @returns Filtered list of posts
 */
export const filterPostsByTags = (posts: Array<Document>, tags: Array<string>,
    allTags?: boolean): Array<Document> => {
  if (posts === null) return null;

  if (allTags) {
   return posts.filter((doc) => {
      if (!doc.attributes.tags) {
        return false;
      }

      // Find a tag that is in tags but not it the document
      if (tags.find((tag) =>
          doc.attributes.tags.indexOf(tag) === -1)) {
        return false;
      }

      return true;
    });
  } else {
    return posts.filter((doc) => {
      if (!doc.attributes.tags) {
        return false;
      }

      // Find a tag that is in the document
      if (tags.find((tag) =>
          doc.attributes.tags.indexOf(tag) !== -1)) {
        return true;
      }

      return false;
    });
  }
};

/**
 * Filters the given posts to only those that have one/all of the given categories
 *
 * @param posts Lists of posts to filter
 * @param categories List of categories to filter on
 * @param allCategories Whether or not to require post has all given categories
 *
 * @returns Filtered list of posts
 */
export const filterPostsByCategories = (posts: Array<Document>,
    categories: Array<string | Array<string>>, allCategories?: boolean): Array<Document> => {
  if (posts === null) return null;

  if (allCategories) {
    return posts.filter((doc) => {
      if (!doc.attributes.categories) {
        return false;
      }

      // Find a category that is in options, but not in the document
      const missingCategory = categories.find((category) => {
        if (Array.isArray(category)) {
          const matchingCategory = doc.attributes.categories.find((docCategory) => {
            if (!Array.isArray(docCategory)
                || docCategory.length < category.length) {
              return;
            }

            for (let i = 0; i < category.length; i++) {
              if (category[i] !== docCategory[i]) {
                return;
              }
            }

            return true;
          });

          return typeof matchingCategory === 'undefined';
        } else {
          const matchingCategory = doc.attributes.categories.find((docCategory) =>
              Array.isArray(docCategory) ? docCategory[0] === category
              : docCategory === category);

          return typeof matchingCategory === 'undefined';
        }
      });

      if (typeof missingCategory !== 'undefined') {
        return false;
      }

      return true;
    });
  } else {
    return posts.filter((doc) => {
      if (!doc.attributes.categories) {
        return false;
      }

      // Find a category that is in the document
      const matchingCategory = categories.find((category) => {
        if (Array.isArray(category)) {
          const matchingCategory = doc.attributes.categories.find((docCategory) => {
            if (!Array.isArray(docCategory)) {
              if (category.length === 1 && docCategory === category[0]) {
                return true;
              }

              return;
            }

            if (docCategory.length < category.length) {
              return;
            }

            for (let i = 0; i < category.length; i++) {
              if (category[i] !== docCategory[i]) {
                return;
              }
            }

            return true;
          });

          return typeof matchingCategory !== 'undefined';
        } else {
          const matchingCategory = doc.attributes.categories.find((docCategory) =>
              Array.isArray(docCategory) ? docCategory[0] === category
              : docCategory === category);

          return typeof matchingCategory !== 'undefined';
        }
      });

      if (typeof matchingCategory !== 'undefined') {
        return true;
      }

      return false;
    });
  }
};
