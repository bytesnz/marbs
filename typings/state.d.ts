import * as Data from './data';
import * as Config from './configs';
import { TagsState } from '../src/reducers/tags';
import { CategoriesState } from '../src/reducers/categories';

export interface Action {
  type: string,
  [data: string]: any
}

export interface State {
  /// Current document
  content: Data.Document,
  /// Posts list
  posts?: Array<Data.Document>
  /// Site tags
  tags?: TagsState,
  /// Site categories
  categories?: CategoriesState
}

export interface Reducers {
  [part: string]: (initialState: any, action: Action) => any
}
