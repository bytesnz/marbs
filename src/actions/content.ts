import { Action } from '../../typings/state';
import { SetGlobalConfig } from '../../typings/configs';
import { Document } from '../../typings/data';

export const MARSS_CONTENT_SET = 'MARSS_CONTENT_SET';
export const MARSS_CONTENT_UPDATE = 'MARSS_CONTENT_UPDATE';
export const MARSS_CONTENT_CLEAR = 'MARSS_CONTENT_CLEAR';

export const createContentActions = ({ getState, dispatch, socket }, options: SetGlobalConfig) => {
  /// Timeout to timeout waiting for tags
  let fetchTimeout = null;
  /// Content id currently being fetched
  let fetchingId = null;

  /**
   * If the new content has a different id to the current content, or if there
   * is no current content, store the new content as the current content.
   * If the new content has the same id as the current content, the new
   * content is stored as a content update (which can be applied using
   * updateContent().
   *
   * @param newContent New content
   */
  const setContent = (newContent: Document) => {
    dispatch({
      type: MARSS_CONTENT_SET,
      data: newContent
    });
  };

  const contentError = (message: string, code: number) => {
    dispatch({
      type: MARSS_CONTENT_SET,
      error: {
        message,
        code,
        date: new Date()
      }
    });
  }

  /**
   * Clears the current content state including any error
   */
  const clearContent = () => {
    dispatch({
      type: MARSS_CONTENT_CLEAR,
    });
  };

  /**
   * Updates the current content from the stored content update in the state
   */
  const updateContent = () => {
    dispatch({
      type: MARSS_CONTENT_UPDATE
    });
  };

  /**
   * Fetch the content for the given id. If content is already being fetched
   * for the given id, the request will be ignored
   */
  const fetchContent = (id: string) => {
    if (fetchTimeout === null || fetchingId !== id) {
      if (fetchTimeout !== null) {
        clearTimeout(fetchTimeout);
      }
      fetchingId = id;
      fetchTimeout = setTimeout(() => {
        contentError('Nobody responded when trying to fetch the content for ' + id, 408);
        fetchTimeout = null;
        fetchingId = null;
      }, 4000);
      socket.emit('content', id);
    }
  };

  // Register for the tags event
  socket.on('content', (data) => {
    clearTimeout(fetchTimeout);
    fetchTimeout = null;

    if (data.error) {
      contentError(data.error, data.code);
      return;
    }

    setContent(data.results);
  });

  return {
    setContent,
    contentError,
    clearContent,
    updateContent,
    fetchContent
  };
};
