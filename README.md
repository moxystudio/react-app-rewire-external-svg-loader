# react-app-rewire-external-svg-loader

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[npm-url]:https://npmjs.org/package/react-app-rewire-external-svg-loader
[npm-image]:http://img.shields.io/npm/v/react-app-rewire-external-svg-loader.svg
[downloads-image]:http://img.shields.io/npm/dm/react-app-rewire-external-svg-loader.svg
[travis-url]:https://travis-ci.org/moxystudio/react-app-rewire-external-svg-loader
[travis-image]:http://img.shields.io/travis/moxystudio/react-app-rewire-external-svg-loader/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/react-app-rewire-external-svg-loader
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/react-app-rewire-external-svg-loader/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/react-app-rewire-external-svg-loader
[david-dm-image]:https://img.shields.io/david/moxystudio/react-app-rewire-external-svg-loader.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/react-app-rewire-external-svg-loader?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/react-app-rewire-external-svg-loader.svg
[greenkeeper-image]:https://badges.greenkeeper.io/moxystudio/react-app-rewire-external-svg-loader.svg
[greenkeeper-url]:https://greenkeeper.io

Adds [`external-svg-sprite-loader`](https://github.com/karify/external-svg-sprite-loader) for CRA apps, using [`react-app-rewired`](https://github.com/timarney/react-app-rewired).


## Installation

```sh
$ npm install --save-dev react-app-rewire-external-svg-loader
```


## Usage

In the `config-overrides.js` you created for `react-app-rewired` add this code:

```js
module.exports = (config, env) => {
    config = require('react-app-rewire-external-svg-loader')(config, env, { /* options */ });

    // You may apply other rewires as well

    return config;
}
```

If you are using the `compose` utility of `react-app-rewired`:

```js
const { compose } = require('react-app-rewired');

module.exports = compose(
    require('react-app-rewire-external-svg-loader')({ /* options */ })
    // ... other rewires
)
```

Available options:

| Name   | Description   | Type     | Default |
| ------ | ------------- | -------- | ------- |
| test | The loader test pattern | string/RegExp | `/\.svg$/` |
| include | The loader include condition | string/Array/RegExp/Function | *src folder* |
| exclude | The loader exclude condition | string/Array/RegExp/Function | |
| loaderOptions | The options to pass to the loader | Object | `{ name: 'static/media/svg-sprite.[hash:8].svg' }` for production, `{ name: 'static/media/svg-sprite.svg' }` otherwise |
| pluginOptions | The options to pass to the loader | Object | `{}` |

If you modify `include` and `exclude` to point to packages in `node_modules`, it's advised to use `fs.realpathSync` so that it plays well with packages linked with `npm link`. Alternatively, you may disable [`resolve.symlinks`](https://webpack.js.org/configuration/resolve/#resolve-symlinks) in your webpack configuration.

### svgxuse

You might want to use [svgxuse](https://github.com/Keyamoon/svgxuse) if you want to support `IE9-11` or if you are serving the sprite from another origin, such as a CDN.

If that's the case, you may load it using a dynamic import to defer it by adding the following code to `src/index.js`:

```js
// ...
import('svgxuse').catch(() => {});
```


## Tests

```sh
$ npm test
$ npm test -- --watch # during development
```


## License

[MIT License](http://opensource.org/licenses/MIT)
