import { Document } from '../../typings/data';

export const filterPostsByTags = (posts: Array<Document>, tags: Array<string>,
    allTags?: boolean): Array<Document> => {
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

export const filterPostsByCategories = (posts: Array<Document>,
    categories: Array<string | Array<string>>, allCategories?: boolean): Array<Document> => {
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
