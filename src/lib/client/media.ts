import { SetGlobalConfig } from '../../../typings/configs';
import { Filter, Media } from '../../../typings/media';
import { assetUrl } from '../utils';

interface Request {
  filter: Filter,
  id: number,
  resolve: (media: Array<Media>) => void,
  reject: (error: Error) => void
}

export const createMedia = (socket, options: SetGlobalConfig) => {
  const requests = [];
  let nextMediaRequestId = 1;

  socket.on('media', (data) => {
    const index = requests.findIndex((request) => request.id === data.id);
    // Check if request exists
    if (index === -1) {
      return;
    }

    const request = requests[index];

    if (data.error) {
      request.reject(data.error);
    } else {
      request.resolve(data.media.map((image) => ({
        ...image,
        src: assetUrl(image.id)
      })));
    }

    requests.splice(index, 1);
  });

  return {
    getMedia (filter: Filter): Promise<Array<Media>> {
      //TODO Use something that can handle a timeout
      return new Promise((resolve, reject) => {
        const request = {
          filter,
          id: nextMediaRequestId++,
          resolve,
          reject
        };

        requests.push(request);

        socket.emit('media', {
          filter,
          id: request.id
        });
      });
    }
  };
};
