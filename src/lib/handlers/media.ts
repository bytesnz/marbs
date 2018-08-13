import * as Handlers from '../../../typings/handlers';
import { ServerConfig } from '../../../typings/configs';
import { Filter } from '../../../typings/media';

import * as path from 'path';
import * as glob from 'glob-promise';
import { watch } from 'chokidar';
import * as md5 from 'md5';
import * as aSizeOf from 'image-size';
import * as util from 'util';
import * as urlJoin from 'join-path';

const sizeOf = util.promisify(aSizeOf);

/**
 * Media (image) file
 */
interface Media {
  id: string,
  width: number,
  type: string,
  height: number,
  path: string,
  gallery: string
};

/**
 * Gallery (folder)
 */
interface Gallery {
  /// MD5 Hash of gallery
  id: string,
  /// Path of gallery
  path: string,
  /// Ids of galleries underneath this gallery
  subGalleries: { [hash: string]: Gallery },
  /// Media contained within this gallery
  media: { [hash: string]: Media }
};

/**
 * Data to retrieve media in a gallery
 */
interface MediaQuery {
  /// ID of query
  id: string | number,
  /// Image filter
  filter: Filter
};

export const handlerCreator: Handlers.HandlerCreator =
    async (config: ServerConfig) => {
  // Media database
  const media: { [hash: string]: Media } = {};
  const galleries: Gallery = {
    id: md5(''),
    path: '',
    subGalleries: {},
    media: {}
  };
  const galleriesMap: { [hash: string ]: Gallery } = {
    [md5('')]: galleries
  };

  const addGallery = async (folderpath) => {
    const pathParts = folderpath.split('/');

    let gallery = galleries.subGalleries;
    let i = 1;

    while (i <= pathParts.length) {
      const galleryPath = pathParts.slice(0, i).join('/');
      const galleryHash = md5(galleryPath);
      if (gallery[galleryHash]) {
        gallery = gallery[galleryHash].subGalleries;
      } else {
        galleriesMap[galleryHash] = {
          id: galleryHash,
          path: galleryPath,
          subGalleries: {},
          media: {}
        };
        gallery[galleryHash] = galleriesMap[galleryHash];
        gallery = galleriesMap[galleryHash].subGalleries;
      }
      i++;
    }
  };

  const handleMedia = async (filepath) => {
    const hash = md5(filepath);

    const pathParts = path.parse(filepath);

    const galleryHash = md5(pathParts.dir);

    // Get the image dimensions
    const dimensions = await sizeOf(path.join(config.staticAssets, filepath));

    media[hash] = {
      ...dimensions,
      id: hash,
      path: filepath,
      gallery: galleryHash
    };

    // Create the image gallery
    if (pathParts.dir) {
      addGallery(pathParts.dir);
    }

    galleriesMap[galleryHash].media[hash] = media[hash];
  };

  const removeMedia = (filepath) => {
    const hash = md5(filepath);

    if (typeof media[hash] !== 'undefined') {
      delete media[hash];
    }
  };

  if (config.staticAssets) {
    const imageFilesGlob = '**/*.@(jpg|jpeg|gif|png|svg|JPG|JPEG|GIF|PNG|SVG)';

    // Load metadata about media
    if (!config.disableFileWatch) {
      console.log('watching for changes in media');
      watch(imageFilesGlob, {
        cwd: config.staticAssets
      }).on('add', (filepath) => {
        console.log('Adding media', filepath);
        handleMedia(filepath);
      }).on('change', (filepath) => {
        console.log('Updating media', filepath);
        handleMedia(filepath);
      }).on('unlink', (filepath) => {
        console.log('Removing media', filepath);
        removeMedia(filepath);
      });
    } else {
      console.log('searching for media in', config.staticAssets);
      await glob(imageFilesGlob, {
        cwd: config.staticAssets
      }).then((files) => {
        return Promise.all(files.map((file) => handleMedia(file)));
      });
    }
  }

  const getMedia = (filter: Filter): Array<Media> => {
    let images = [];

    if (!filter.ids) {
      return Object.values(media);
    }

    filter.ids.forEach((id) => {
      // Check if id is an image
      let image;
      image = media[id];
      // Check if the id is the path
      if (!image) {
        image = media[md5(id)];
      }

      if (image) {
        // Add image if not already in there
        if (images.indexOf(image) === -1) {
          images.push(image);
        }
      } else {
        // Check if it is an id for a gallery
        let gallery = galleriesMap[id];

        // Check if the id is the path
        if (!gallery) {
          gallery = galleriesMap[md5(id)];
        }

        if (gallery) {
          // Add images from gallery
          images = images.concat(Object.values(gallery.media));

          if (filter.subGalleries) {
            images = images.concat(getMedia({
              ...filter,
              ids: Object.keys(gallery.subGalleries),
            }));
          }
        }
      }
    })

    return images;
  };

  return {
    get media () {
      return JSON.parse(JSON.stringify(media));
    },
    get galleries () {
      return JSON.parse(JSON.stringify(galleries));
    },
    getMedia,
    events: {
      media: (socket, data: MediaQuery): void => {
        if (!data || !data.id) {
          return
        }

        if (!data.filter || !data.filter.ids) {
          socket.emit('media', {
            id: data.id,
            error: 'Require a gallery ids'
          });
          return;
        }

        try {
          const images = getMedia(data.filter).map((media) => ({
            type: media.type,
            id: media.id,
            width: media.width,
            height: media.height
          }));

          socket.emit('media', {
            id: data.id,
            media: images
          });
        } catch (error) {
          socket.emit('media', {
            id: data.id,
            error
          });
        }
      }
    },
    paths: {
      get: {
        [urlJoin(config.baseUri, config.staticUri, ':id')]: (req, res, next) => {
          if (req.params.id) {
            if (media[req.params.id]) {
              res.sendFile(path.resolve(path.join(config.staticAssets, media[req.params.id].path)));
            } else {
              // See if we can match the file from the filename
              const fileHash = Object.keys(media).find((hash) => media[hash].path === req.params.id)

              if (fileHash) {
                res.sendFile(path.resolve(path.join(config.staticAssets, media[fileHash].path)));
              }
            }
          } else {
            res.status(404).end();
            return;
          }
        }
      }
    }
  };
};
