# Scripts

[npm](https://www.npmjs.com/) manages the development dependencies for the assets. [Grunt](http://gruntjs.com/) builds the styles and scripts.

Ensure [Node.js](http://nodejs.org/) is installed.

Install development dependencies:

```
npm install
```

The following scripts are referenced directly and are not included in the Grunt build, but are included in the Jekyll build:

- disqus-comment-thread.js - only required on the post pages
- html5shiv.js - must be included before the opening `<body>` tag

To build the scripts, run:

```
grunt scripts
```

To build a development version, including a source map, run:

```
grunt scripts:dev
```
