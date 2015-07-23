# Styles

[npm](https://www.npmjs.com/) manages the development dependencies for the assets. [Grunt](http://gruntjs.com/) builds the styles and scripts.

Ensure [Node.js](http://nodejs.org/) is installed.

Install development dependencies:

```
npm install
```

To build the styles, run:

```
grunt styles
```

To build a development version, including a source map, run:

```
grunt styles:dev
```

---

N.B. As a relatively old version of Twitter Bootstrap is used, the latest version of LESS cannot be used due to compatibilty issues.
