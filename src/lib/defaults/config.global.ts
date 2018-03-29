import { SetGlobalConfig } from '../../../typings/configs';

export default <SetGlobalConfig>{
  title: 'MARSS Web App',
  baseUri: '/',
  functionality: {
    tags: true,
    categories: true,
    search: ['title', 'tags', 'categories']
  },
  windowTitle: (config, contentTitle) => `${contentTitle} - ${config.title}`,
  tagsUri: 'tags',
  categoriesUri: 'categories',
  staticUri: 'static',
  listLastOnIndex: 10
}
