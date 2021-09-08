[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![npm version](https://badge.fury.io/js/@w3ctech-editorial-department%2Fcraco-antd-mobile.svg)](https://badge.fury.io/js/@w3ctech-editorial-department%2Fcraco-antd-mobile)

---

# Craco Ant Design Mobile Plugin

This is a [craco](https://github.com/gsoft-inc/craco) plugin that makes it easy to use the [Ant Design Mobile](https://mobile.ant.design/) UI library with [create-react-app](https://facebook.github.io/create-react-app/) version >= 4.

`@w3ctech-editorial-department/craco-antd-mobile` includes:

- An easy way to customize the theme
- Less support (provided by [craco-less](https://github.com/DocSpring/craco-less))
- Only import the required CSS (provided by [babel-plugin-import](https://github.com/ant-design/babel-plugin-import))

## Installation

First, follow the beginning section of the [Ant Design Mobile `create-react-app` Documentation](https://mobile.ant.design/docs/react/use-with-create-react-app) to set up your own app with Ant Design Mobile.

Then, follow the [`craco` Installation Instructions](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#installation) to install the `craco` package, create a `craco.config.js` file, and modify the scripts in your `package.json`.

Finally, install `@w3ctech-editorial-department/craco-antd-mobile` and `antd-mobile`:

```bash
$ yarn add antd-mobile && yarn add -D @w3ctech-editorial-department/craco-antd-mobile

# OR

$ npm i antd-mobile && npm i -D @w3ctech-editorial-department/craco-antd-mobile
```

> `@w3ctech-editorial-department/craco-antd-mobile` only has a "peer dependency" for `antd-mobile >= 2.3.4`. So you should add a suitable version of `antd-mobile` to your own `package.json`.

## Basic Usage

Here is a complete `craco.config.js` configuration file that sets up Less compilation and `babel-plugin-import` for `create-react-app`:

```js
const CracoAntDesignMobilePlugin = require("@w3ctech-editorial-department/craco-antd-mobile");

module.exports = {
  plugins: [{ plugin: CracoAntDesignMobilePlugin }],
};
```

## Customize Ant Design Mobile Theme

You can modify the default Ant Design Mobile theme by changing some Less variables.

`@w3ctech-editorial-department/craco-antd-mobile` will look for variables in a Less file at `./antd-mobile.customize.less`. (You can customize this file path with the `customizeThemeLessPath` option.)

```less
@brand-primary: #00eaa9;
```

> [Here's a list of all the variables that can be modified.](https://github.com/ant-design/ant-design-mobile/blob/2.3.x/components/style/themes/default.less)

You can also customize these variables directly in your `craco.config.js` with the `customizeTheme` option:

```js
const CracoAntDesignMobilePlugin = require("@w3ctech-editorial-department/craco-antd-mobile");

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignMobilePlugin,
      options: {
        customizeTheme: {
          "@brand-primary": "#00eaa9",
        },
      },
    },
  ],
};
```

> `customizeTheme` is just an alias for the `modifyVars` option in `less-loader`.

If you use multiple options to customize the theme variables, they are merged together in the following order:

- `options.customizeThemeLessPath` (default: `./antd-mobile.customize.less`)
- `options.customVarsJSONPath` (default: `./antd-mobile.customize.json`)
- `options.customizeTheme`
- `options.lessLoaderOptions.modifyVars`

> For more information, see Ant Design Mobile's ["Customize Theme" documentation](https://mobile.ant.design/docs/react/customize-theme).

## Options

You can pass an `options` object to configure the loaders and plugins. You can also pass a `modifyLessRule` callback to have full control over the Less webpack rule.
See the [`craco-less`](https://github.com/DocSpring/craco-less#configuration) documentation for more information about these options:

- `options.modifyLessRule`
- `options.cssLoaderOptions`
- `options.lessLoaderOptions`
- `options.styleLoaderOptions`
- `options.postcssLoaderOptions`
- `options.miniCssExtractPluginOptions`

See the [`babel-plugin-import`](https://github.com/ant-design/babel-plugin-import#options) documentation for more information about this option:

- `options.babelPluginImportOptions`

Example:

```js
module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            noIeCompat: true,
            strictMath: true,
            modifyVars: { "@brand-primary": "#00eaa9" },
          },
        },
        cssLoaderOptions: {
          modules: true,
          localIdentName: "[local]_[hash:base64:5]",
        },
        babelPluginImportOptions: {
          libraryDirectory: "es",
        },
      },
    },
  ],
};
```

## License

[MIT](./LICENSE)
