import * as handlers from './handlers';

export interface AppFunctionalityConfig {
  /// Generate and load tag list
  tags?: boolean,
  /// Generate and load category list
  categories?: boolean,
  /// Search in the given post fields
  search?: Array<string>,
  /** Whether or not to preload the tags count. If set, server
   *  rendering / client rerendering of the page will be blocked until the
   *  categories list is loaded. */
  preloadTags?: boolean,
  /** Whether or not to preload the categories count. If set, server
   *  rendering / client rerendering of the page will be blocked until the
   *  categories list is loaded. */
  preloadCategories?: boolean,
  /** If and how many post details to preload. If set, server
   *  rendering / client rerendering of the page will be blocked until the
   *  categories list is loaded. */
  proloadPostDetails?: number
}

export interface GlobalConfig {
  /// The title of the web app (default: MARSS Web App)
  title?: string,
  /// Base URI for the app (default: /)
  baseUri?: string,
  /// The basename that static elements will be served from (default: static/)
  staticUri?: string,
  /// Path to use for socketIO (default: SocketIO default path: /socket.io)
  socketPath?: string,
  /// Functionality to be enabled in the web app
  functionality?: AppFunctionalityConfig,
  /// URI for tags page (default: tags)
  tagsUri?: string,
  /// URI for categories page (default: categories)
  categoriesUri?: string,
}

export interface SetGlobalConfig extends GlobalConfig {
  title: string,
  baseUri: string,
  functionality: AppFunctionalityConfig,
  tagsUri: string,
  categoriesUri: string
}

export interface UserServerConfig {
  /// The folder that the content (Markdown) files are stored in (default: source)
  source?: string,
  /// The folter containing static assests (default: no static assests will be served)
  staticAssets?: string,
  /// Port to listen on (default: 8080)
  port?: number
  /// Regular expression to detect if the file is draft (and should not be added to lists)
  /// Should exclude the .md file extension (default: /.draft$/)
  draftRegex?: string,
  /// Custom handlers for handling socket events
  handlers?: { [id: string]: handlers.Handler }
}

export interface SetServerConfig extends UserServerConfig {
  source: string,
  port: number,
  draftRegex: string
}

export interface ServerConfig extends SetServerConfig, GlobalConfig {
}

