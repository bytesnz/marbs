import * as Data from './data';
import * as Config from './configs';

export interface Action {
  type: string,
  [data: string]: any
}

export interface State {
  /// Options
  options: Config.SetGlobalConfig,
  /// Current document
  contents: Data.Document,
  /// Site tags
  tags?: Data.Tags,
  /// Site categories
  categories?: Data.Categories
}

export interface Reducers {
  [part: string]: (initialState: any, action: Action) => any
}
