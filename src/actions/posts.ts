import { Action } from '../../typings/state';
import { SetGlobalConfig } from '../../typings/configs';
import { Document } from '../../typings/data';

export const MARSS_POSTS_SET = 'MARSS_POSTS_SET';
export const MARSS_POSTS_UPDATE = 'MARSS_POSTS_UPDATE';

export const createPostsActions = ({ getState, dispatch, socket }, options: SetGlobalConfig) => {
  /// Timeout to timeout waiting for tags
  let fetchTimeout = null;

  /// Search timeouts
  let searchTimeouts;

  const setPosts = (newPosts: Array<Document>) => {
    dispatch({
      type: MARSS_POSTS_SET,
      data: newPosts
    });
  };

  const postsError = (message: string, code: number) => {
    dispatch({
      type: MARSS_POSTS_SET,
      error: {
        message,
        code,
        date: new Date()
      }
    });
  };

  const updatePosts = (posts: Array<Document>) => {
    dispatch({
      type: MARSS_POSTS_UPDATE,
      data: posts
    });
  };

  const fetchPosts = () => {
    if (getState().posts === null && fetchTimeout === null) {
      fetchTimeout = setTimeout(() => {
        postsError('Nobody responded when trying to fetch the posts count', 408);
        fetchTimeout = null;
      }, 4000);
      socket.emit('documents');
    }
  };

  // Register for the tags event
  socket.on('documents', (data) => {
    clearTimeout(fetchTimeout);
    fetchTimeout = null;

    if (data.error) {
      postsError(data.error, data.code);
      return;
    }

    setPosts(data.results);
  });

  return {
    setPosts,
    updatePosts,
    fetchPosts
  };
};
