import { UserServerConfig, ServerConfig } from '../typings/configs';
import {
  HandlerCreators,
  HandlerCreator,
  HandlerObject,
  InitialisedHandlers
} from '../typings/handlers';

import * as urlJoin from 'join-path';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as promisify from 'es6-promisify';
const access = (util.promisify || promisify)(fs.access);

import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';

import { createMarss, Provider as MarssContext } from './lib/client/marss';
import { Manager, Provider as LoaderProvider } from './components/loader';

import App from './app/app';

import baseContentHandlers from './lib/handlers';

import defaultGlobalConfig from './lib/defaults/config.global';
import defaultServerConfig from './lib/defaults/config.server';

const defaultConfig: ServerConfig = {
  ...defaultGlobalConfig,
  ...defaultServerConfig
};

const globalConfig = path.resolve('./config.global.js');
const serverConfig = path.resolve('./config.server.js');

export class Marss {
  config: ServerConfig;
  protected handlers: InitialisedHandlers = {
    content: null
  };
  protected initialising: Promise<any>;

  constructor (config?: UserServerConfig) {
    this.config = {
      ...defaultConfig
    };

    // Load in config files
    this.initialising = Promise.all([globalConfig, serverConfig].map((file) => file && access(file, 'r').then(
      () => {
        let content = require(file);
        if (typeof content === 'object') {
          if (typeof content.default !== 'undefined') {
            content = content.default;

            if (typeof content !== 'object') {
              console.error(`Default value in ${file} not an Object`);
              return;
            }
          }

          this.config = Object.assign(this.config, content);
          return;
        }

        console.error(`Value in ${file} not an Object`);
      },
      (err) => (err.code === 'ENOENT' ? undefined : err)
    ))).then(() => {
      // TODO Check validaty of config?
      if (!this.config.draftRegex) {
        this.config.draftRegex = defaultConfig.draftRegex;
      }

      // Create complete content handlers
      const contentHandlers: HandlerCreators = Object.assign({}, baseContentHandlers, this.config.handlers);

      if (!contentHandlers['content']) {
        return Promise.reject(new Error('No content handler for main content'));
      }

      let promises = [];

      console.log('config is', this.config);
      // Run content handler inits if defined
      Object.keys(contentHandlers).forEach((id) => {
        const value = contentHandlers[id](this.config);

        if (value instanceof Promise) {
          promises.push(value.then((handler) => {
            this.handlers[id] = handler;
          }));
        } else {
          this.handlers[id] = value;
        }
      });

      return Promise.all(promises).then(() => this.handlers);
    }).then(() => {
      this.initialising = null;
    })
  }

  /**
   * Return a list of pages that are currently available
   */
  getPages () {
  }

  getConfig (): Promise<ServerConfig> {
    if (this.initialising instanceof Promise) {
      return this.initialising.then(() => this.config);
    } else {
      return Promise.resolve(this.config);
    }
  }

  getHandlers (): Promise<InitialisedHandlers> {
    if (this.initialising instanceof Promise) {
      return this.initialising.then(() => this.handlers);
    } else {
      return Promise.resolve(this.handlers);
    }
  }

  /**
   * Generates tha HTML for a specific page
   *
   * @param uri URI to return the content for
   * @param html Base HTMLto put the content in
   *
   * @returns [ statusCode, html ]
   */
  generatePage (uri: string, html: string | Promise<string>):
    Promise<[number, string]> {
    console.log('generating page for', uri);

    return new Promise((resolve, reject) => {
      // Create mock socket
      const serverHandlers = {};
      const clientHandlers = {};

      const serverSocket = {
        emit: (event, ...data) => {
          if (clientHandlers[event]) {
            clientHandlers[event].forEach((handler) => {
              handler(...data);
            });
          }
        }
      };

      Object.entries(this.handlers).forEach(([id, handler]) => {
        if (handler.events) {
          Object.keys(handler.events).forEach((event) => {
            if (serverHandlers[event]) {
              serverHandlers[event].push(handler.events[event]);
            } else {
              serverHandlers[event] = [ handler.events[event] ];
            }
          });
        }
      });

      const clientSocket = {
        emit: (event, ...data) => {
          if (serverHandlers[event]) {
            serverHandlers[event].forEach((handler) => {
              handler(serverSocket, ...data);
            });
          }
        },
        on: (event, handler) => {
          if (clientHandlers[event]) {
            clientHandlers[event].push(handler);
          } else {
            clientHandlers[event] = [ handler ];
          }
        }
      };

      // Create marss instance
      createMarss(this.config, clientSocket).then((marss) => {
        try {
          const loader = new Manager();

          let element = React.createElement(StaticRouter, {
            location: urlJoin(this.config.baseUri, uri),
            context: {}
          }, React.createElement(LoaderProvider, {
            value: loader
          }, React.createElement(MarssContext, {
            marss: marss
          }, React.createElement(App, {}) ) ) );

          const insertStatic = (content, appString) => {
            const helmet = Helmet.renderStatic();
            content = content.replace(/(<div id="app">)(<\/div>)/, '$1' + appString + '$2');
            content = content.replace(/(<\/head>)/,
                helmet.title.toString() +
                helmet.meta.toString() +
                helmet.link.toString() +
                '$1');
            content = content.replace(/ data-react-helmet="true"/g, '');

            return content;
          };

          const waitRender = () => {
            const appString = renderToString(element);

            if (loader.loading) {
              loader.loading.then((errors) => {
                if (errors && errors.length) {
                }

                waitRender();
              });
            } else {
              // Return string
              if (html instanceof Promise) {
                html.then((content) => {
                  resolve([200, insertStatic(content, appString)]);
                });
              } else {
                resolve([200, insertStatic(html, appString)]);
              }
            }
          };

          console.log('running waitRender');

          waitRender();
        } catch (error) {
          reject(error);
        }
      }, (error) => {
        reject(error);
      });
    });
  }
}
