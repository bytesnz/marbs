import * as Handlers from '../../../typings/handlers';
import { ServerConfig } from '../../../typings/configs';
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
  /// Hash of gallery
  ids: string | Array<string>,
  /// Whether or not to include media of subdirectories of the galleries
  subdirectories?: boolean
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

  const imageFilesGlob = '**/*.@(jpg|jpeg|gif|png|svg)';

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

  return {
    get media () {
      return JSON.parse(JSON.stringify(media));
    },
    get galleries () {
      return JSON.parse(JSON.stringify(galleries));
    },
    events: {
      media: (socket, data: MediaQuery) => {
        if (!data || !data.ids) {
          socket.emit('media', {
            error: 'Require a gallery ids'
          });
          return;
        }

        if (!Array.isArray(data.ids)) {
          data.ids = [ data.ids ];
        }

        // Check for invalid errors
        const badGalleries = [];

        data.ids.forEach((id) => {
          if (!galleriesMap[id]) {
            badGalleries.push(id);
          }
        });

        if (badGalleries.length) {
          let message;

          if (badGalleries.length === 1) {
            message = `Gallery ${badGalleries[0]} does not exist`;
          } else {
            message = badGalleries.push();
            message = `Galleries ${badGalleries.join(', ')} and ${message} do no exist`;
          }

          socket.emit('media', {
            error: message
          });
          return;
        }

        // Add subdirectories to array
        if (data.subdirectories) {
          let allIds = [ ...data.ids ];
          const galleriesLength = allIds.length;

          const addSubGalleries = (id) => {
            Object.keys(galleriesMap[id].subGalleries).forEach((subId) => {
              if (data.ids.indexOf(subId) === -1) {
                allIds.push(subId);
              }
            });
          };

          allIds.forEach(addSubGalleries);

          data.ids = allIds;
        }

        let returnedMedia = [];

        // Make array of media
        data.ids.forEach((id) => {
          returnedMedia = returnedMedia.concat(Object.values(galleriesMap[id].media));
        });

        socket.emit('media', {
          ...data,
          media: returnedMedia.map((media) => ({
            id: media.id,
            type: media.type,
            width: media.width,
            height: media.height
          }))
        });
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
