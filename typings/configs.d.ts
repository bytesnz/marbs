import * as handlers from './handlers';

interface BaseMenuItem {
  label: string
}

interface MenuLink extends BaseMenuItem {
  link: string
}

interface MenuHeading extends BaseMenuItem {
  children: Array<MenuItem>
}

type MenuItem = MenuHeading | MenuLink;

export interface AppFunctionalityConfig {
  /// Generate and load tag list
  tags?: boolean,
  /// Generate and load category list
  categories?: boolean,
  /// Use the media module
  media?: boolean,
  /// Search in the given post fields
  search?: Array<string>,
  /** TODO Whether or not to preload the tags count. If set, server
   *  rendering / client rerendering of the page will be blocked until the
   *  categories list is loaded. */
  preloadTags?: boolean,
  /** TODO Whether or not to preload the categories count. If set, server
   *  rendering / client rerendering of the page will be blocked until the
   *  categories list is loaded. */
  preloadCategories?: boolean,
  /** TODO If and how many post details to preload. If set, server
   *  rendering / client rerendering of the page will be blocked until the
   *  categories list is loaded. */
  proloadPostDetails?: number
}

export interface GlobalConfig {
  /// The title of the web app (default: MARSS Web App)
  title?: string,
  /// Description of site
  description?: string,
  /// Base URI for the app (default: /)
  baseUri?: string,
  /// The basename that static elements will be served from (default: static/)
  staticUri?: string,
  /// Custom paths for the handler paths, where path is <handler_id>/<handler_path>
  handlerUris?: {
    [path: string]: string
  },
  /// Path to use for socketIO (default: SocketIO default path: /socket.io)
  socketPath?: string,
  /// Functionality to be enabled in the web app
  functionality?: AppFunctionalityConfig,
  /**
   * Function to use to generate the Window title for content
   *
   * @param config MARSS global config
   * @param contentTitle Content title
   *
   * @returns Window title
   */
  windowTitle?: (config: SetGlobalConfig, contentTitle: string) => string,
  /// URI for tags page (default: tags)
  tagsUri?: string,
  /// URI for categories page (default: categories)
  categoriesUri?: string,
  /** TODO Enable showing a category on its own page for all categories (if set to
   *  true), or for the given categories. If only selected categories are
   *  given, the given categories won't be displayed on the main categories
   *  list page
   */
  categoriesPerPage?: boolean | Array<string>,
  /// Menu items
  menu?: Array<MenuItem>,
  /// Function to use to generate the page title
  pageTitle?: (pageTitle: string) => string,
  /// List of Remarkable plugins to include
  remarkablePlugins?: Array<(md) => void>,
  /// Object of Remarkably Simple Tags to use when rendering the Markdown
  rstTags?: {
    [tag: string]: {
      handler: (parameters: string | Array<string>, opts: any) => string,
      multiple?: boolean
    }
  },
  /** Add a list of the last x posts to the index page (default: 10).
   *  A value of 0 will list all the posts. A value of -1 or null will not list
   *  any posts
   */
  listLastOnIndex?: number,
  /** Whether or not the lists of posts on the categories and tags are
   * expandable
   */
  expandableLists?: boolean
}

export interface SetGlobalConfig extends GlobalConfig {
  title: string,
  baseUri: string,
  functionality: AppFunctionalityConfig,
  tagsUri: string,
  categoriesUri: string,
  staticUri: string
}

export interface UserServerConfig {
  /// The folder that the content (Markdown) files are stored in (default: source)
  source?: string,
  /// The folder containing static assests (default: no static assests will be served)
  staticAssets?: string,
  /// Address to listen on (default: 127.0.0.1)
  address?: string,
  /// Port to listen on (default: 7765)
  port?: number
  /// Regular expression to detect if the file is draft (and should not be added to lists)
  /// Should exclude the .md file extension (default: /.draft$/)
  draftRegex?: string,
  /// Custom handlers for handling socket events
  handlers?: { [id: string]: handlers.HandlerCreator },
  /// Whether or not to cache the content markdown
  cacheMarkdown?: boolean,
  /// Whether or not to disable watching for new documents if using a file-based content handler
  disableFileWatch?: boolean,
  /// Server-side markdown tag ({% %}) handlers
  serverTags?: {
    [tag: string]: (attributes?: Array<string>) => string
  }
}

export interface SetServerConfig extends UserServerConfig {
  address: string,
  source: string,
  port: number,
  draftRegex: string
}

export interface ServerConfig extends SetServerConfig, SetGlobalConfig {
}

