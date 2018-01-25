# marss
**M**arkdown **a**nd **R**eact **s**tatic content web app **s**ystem.

A single-page web app for serving static content written in Markdown. The
NodeJS backend stores and caches metadata about the content, enabling it to be
searched through and delivered quickly.

## Reasoning
I originally used Wordpress for my blog. A great system, but very large, and
written in PHP and MySQL. I looked at Hexo, but had a few issues generating the
content. I also wanted my blog to be a single page app to make it faster to
navigate and load.

## **Envisioned** Features
Initial features will include:
- Posts etc are files written in Markdown files with front-matter metadata
  (using [markdown-it](https://github.com/markdown-it/markdown-it) and
  [markdown-it-front-matter](https://github.com/craigdmckenna/markdown-it-front-matter)
- Supports tags, categories and page (template) types
Later features will include:
- Support for offline app mode and offline reading of articles
- Support for push notifications of new articles
- Support for Geo-positioning of content

## Technologies
- NodeJS
- React
- Markdown
- Web Sockets
- MathTex
- Service Worker

## **Envisioned** File Layout
```
 - index.js - Server script
 - config.global.js - Configuration options used in both the client and the server
 - config.server.js - Configuration options specific to the server
 - reducers/ - Redux reducers for marss store
 - actions/ - Redux actions for the marrs store
 - components/ - React components for marss
 - lib/ - Library components for marss functionality
 \ - client/ - client app library components for marss functionality
 - src - Source code (typescript)
 \- app - Source code for the client side app
  |- index.tsx - Main client app script
  \- style/index.scss - Main style file for the app (included in index.tsx)
```
