import * as nconf from 'nconf';
import * as Data from './data';
import * as SocketIO from 'socket.io';

type EventHandler = Function; //(socket: Socket) => void;

export type Conf = nconf.IStore;

export interface Handler {
  /**
   * Initialisation function to be called before the server is set up
   *
   * @param conf Configuration options given to MARSS
   *
   * @returns A Promise that resolves once the initialisation is complete or
   *   null if  initialisation is complete once the function returns
   */
  init?(conf: Conf): Promise<void> | null;

  /**
   * SocketIO event handlers
   */
  events?: {
    [event: string]: EventHandler
  }
}

export type HandlerCreator = (conf: nconf.IStore) => Promise<Handler> | Handler;

interface SocketDocumentsRetrievalOptions {
  /// Type of documents to return
  type?: string;
  /// Fields of documents to return
  fields?: Array<string>;
  /// Whether or not to include the body of the document
  includeBody?: boolean;
  /// Only return documents with the given date or documents within the date range
  date?: Date | [ Date, Date ];
  /// Only return documents will any the given tags
  tags?: Array<string>;
  /// Return documents that only have all of the tags given in `tags`
  allTags?: boolean;
  /// Only return documents with any the given categories
  categories?: Array<string | Array<string>>;
  /// Return document that only have all of the categories given in `categories`
  allCategories?: boolean;
}

interface DocumentsRetrievalOptions extends SocketDocumentsRetrievalOptions {
  // Whether or not to include draft documents
  includeDrafts?:boolean;
}

export interface ContentHandler extends Handler {
  /**
   * Get a list of documents
   *
   * @param options Options to select which documents to retrieve
   */
  documents(options?: DocumentsRetrievalOptions): Promise<Data.Document>;
  /**
   * Get the content with the given URI
   *
   * @param uri URI to find the content of
   *
   * @returns Promise that will resolve to the content of the given URI or
   *   undefined if there is no content of the given URI
   */
  get(uri: string): Promise<Data.Document>;

  /**
   * Gets the tags and the number of posts with each tag
   * 
   * @returns Promise that resolves to an Object containing the tags with the
   *   tag id as the key
   */
  tags(): Promise<Data.Tags>;

  events: {
    /**
     * Get content event handler. Should emit a content event back to the
     * client once the content is retrieved
     *
     * @param socket SocketIO socket to send response back on
     * @param uri URI to retrieve content for
     */
    content: (socket: SocketIO.Socket, uri: string) => any;
    /**
     * Get tags event handler
     */
    tags: EventHandler;
    /// Any additional events the content handler should listen for
    [event: string]: EventHandler;
  }
}

export type ContentHandlerCreator = (conf: nconf.IStore) => Promise<ContentHandler> | ContentHandler;

export interface Handlers {
  content: ContentHandler,
  [id: string]: Handler
}
