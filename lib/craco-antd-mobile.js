const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')
const CracoLessPlugin = require('craco-less')

/* istanbul ignore next */
const readAntdMobileCustomizeConfiguration = (filename) => {
  if (!filename) return false

  const finalFileName = path.resolve(process.cwd(), filename)
  if (!fs.existsSync(finalFileName)) return false

  return fs.readFileSync(finalFileName, 'utf8')
}

const overrideWebpackConfig = ({
  context,
  webpackConfig,
  pluginOptions = {},
}) => {
  const modifyVars = {}

  const antdMobileCustomVarsLess = readAntdMobileCustomizeConfiguration(
    pluginOptions.customizeThemeLessPath ||
      `.${path.sep}antd-mobile.customize.less`,
  )
  if (antdMobileCustomVarsLess) {
    Object.assign(modifyVars, lessToJs(antdMobileCustomVarsLess))
  }

  const antdMobileCustomVarsJSON = readAntdMobileCustomizeConfiguration(
    pluginOptions.customVarsJSONPath ||
      `.${path.sep}antd-mobile.customize.json`,
  )
  if (antdMobileCustomVarsJSON) {
    let antdMobileCustomVars = {}

    try {
      antdMobileCustomVars = JSON.parse(antdMobileCustomVarsJSON)
    } catch (error) {
      throw new Error(error)
    }

    Object.assign(modifyVars, antdMobileCustomVars)
  }

  if (pluginOptions.customizeTheme) {
    Object.assign(modifyVars, pluginOptions.customizeTheme)
  }

  const lessLoaderOptions = pluginOptions.lessLoaderOptions || {}
  lessLoaderOptions.lessOptions = lessLoaderOptions.lessOptions || {}
  if (lessLoaderOptions.lessOptions.modifyVars) {
    Object.assign(modifyVars, lessLoaderOptions.lessOptions.modifyVars)
  }

  lessLoaderOptions.lessOptions.modifyVars = modifyVars
  // javascriptEnabled: true is suggested in the Ant Design docs:
  // https://ant.design/docs/react/customize-theme#Customize-in-webpack
  lessLoaderOptions.lessOptions.javascriptEnabled = true

  return CracoLessPlugin.overrideWebpackConfig({
    context,
    webpackConfig,
    pluginOptions: {
      ...[
        'modifyLessRule',
        'cssLoaderOptions',
        'styleLoaderOptions',
        'postcssLoaderOptions',
        'miniCssExtractPluginOptions',
      ].reduce(
        (object, key) => ({
          ...object,
          [key]: pluginOptions[key] || {},
        }),
        {},
      ),
      lessLoaderOptions,
    },
  })
}

module.exports = {
  overrideWebpackConfig,
  overrideCracoConfig: ({ cracoConfig, pluginOptions }) => {
    if (!cracoConfig.babel) cracoConfig.babel = {}
    if (!cracoConfig.babel.plugins) cracoConfig.babel.plugins = []

    // `style: true` loads the original Less so that variables can be modified.
    const babelPluginImportOptions = {
      libraryName: 'antd-mobile',
      libraryDirectory: 'lib',
      style: true,
    }
    if (pluginOptions && pluginOptions.babelPluginImportOptions) {
      Object.assign(
        babelPluginImportOptions,
        pluginOptions.babelPluginImportOptions,
      )
    }
    cracoConfig.babel.plugins.push([
      'import',
      babelPluginImportOptions,
      'antd-mobile',
    ])

    return cracoConfig
  },
}
