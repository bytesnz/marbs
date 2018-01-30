import * as handlers from './handlers';

export interface AppFunctionalityConfig {
  /// Generate and load tag list
  tags?: boolean,
  /// Generate and load category list
  categories?: boolean,
  /// Search in the given post fields
  search?: Array<string>
}

export interface GlobalConfig {
  /// The title of the web app (default: MARSS Web App)
  title?: string,
  /// Base URI for the app (default: /)
  baseUri?: string,
  /// The basename that static elements will be served from (default: static/)
  staticBasename?: string,
  /// Path to use for socketIO (default: SocketIO default path: /socket.io)
  socketPath?: string,
  /// Functionality to be enabled in the web app
  functionality?: AppFunctionalityConfig
}

export interface DefaultGlobalConfig extends GlobalConfig {
  title: string,
  baseUri: string,
  functionality: AppFunctionalityConfig
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
  draftRegex?: RegExp,
  /// Custom handlers for handling socket events
  handlers?: { [id: string]: handlers.Handler }
}

export interface DefaultServerConfig extends UserServerConfig {
  source: string,
  port: number,
  draftRegex: RegExp
}

export interface ServerConfig extends DefaultServerConfig, GlobalConfig {
}

