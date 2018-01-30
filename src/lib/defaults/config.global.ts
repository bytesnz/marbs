import { DefaultGlobalConfig } from '../../../typings/configs';

export default <DefaultGlobalConfig>{
  title: 'MARSS Web App',
  baseUri: '/',
  functionality: {
    tags: true,
    categories: true,
    search: ['title', 'tags', 'categories']
  }
}
