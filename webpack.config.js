const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ngToolsWebpack = require('@ngtools/webpack')
const HtmlPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin');

const TEST_ASSETS = /assets\/.*\.scss$/;
const OUTPUT_PATH = path.resolve(__dirname, 'dist')
const SOURCE_PATH = path.resolve(__dirname, 'src')
const STATS = {
  colors: true,
  hash: true,
  timings: true,
  chunks: true,
  chunkModules: false,
  children: false,
  modules: false,
  reasons: false,
  warnings: true,
  assets: false,
  version: false
}

function getWebpackCompiler () {
  let plugin
  switch (process.env.NODE_ENV) {
    case 'testing':
      plugin = new ngToolsWebpack.AotPlugin({
        tsConfigPath: './src/tsconfig.spec.json',
        skipCodeGeneration: true
      })
      break
    case 'development':
      plugin = new ngToolsWebpack.AotPlugin({
        tsConfigPath: './src/tsconfig.app.json',
        mainPath: path.resolve(__dirname, SOURCE_PATH, 'main.ts'),
        skipCodeGeneration: true
      })
      break
    case 'production':
      plugin = new ngToolsWebpack.AotPlugin({
        tsConfigPath: './src/tsconfig.app.json',
        mainPath: path.resolve(__dirname, SOURCE_PATH, 'main.ts')
      })
      break
  }
  return plugin
}

const webpackConfig = {
  context: SOURCE_PATH,
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      SOURCE_PATH
    ]
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: '',
    filename: '[name].bundle.js'
  },
  plugins: [
    getWebpackCompiler(),
    new ExtractTextPlugin('main.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['main'],
      minChunks(module) {
        return /node_modules/.test(module.resource)
      }
    }),
    new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      SOURCE_PATH, {
        // your Angular Async Route paths relative to this root directory
      })
  ],
  module: {
    loaders: [
      // { test: /\.scss$/, exclude: TEST_ASSETS, loaders: ['raw-loader', 'sass-loader'] },
      { test: TEST_ASSETS, use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })},
      // load scss from app as raw css strings
      { test: /\.scss$/, exclude: TEST_ASSETS, loaders: ['to-string-loader', 'css-loader', 'sass-loader'] },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.ts$/, loader: '@ngtools/webpack' },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.png$/, loader: "url-loader?mimetype=image/png" },
      { test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.pug$/, loaders: [
        'html-loader', {
          loader: 'pug-html-loader',
          options: {
            doctype: 'html'
          }
        }
      ]}
    ]
  },
  stats: STATS
};

const webpackEnv = {
  // Production
  production: {
    devtool: 'source-map',
    entry: {
      polyfills: 'polyfills.ts',
      main: 'main.ts'
    },
    plugins: [
      new HtmlPlugin({
        filetype: 'pug',
        template: 'index.pug',
        hash: true
      }),
      new webpack.NormalModuleReplacementPlugin(
        /src\/environments\/environment.ts/,
        'environment.production.ts'
      )
    ]
  },
  // Development
  development: {
    devtool: 'cheap-module-source-map',
    entry: {
      polyfills: 'polyfills.ts',
      main: 'main.ts'
    },
    plugins: [
      new WriteFilePlugin({
        log: false
      }),
      new HtmlPlugin({
        filetype: 'pug',
        template: 'index.pug',
        hash: true
      })
    ],
    devServer: {
      contentBase: OUTPUT_PATH,
      historyApiFallback: true,
      stats: STATS
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      //   'Access-Control-Allow-Credentials': 'true',
      //   'Content-Security-Policy': 'default-src \'self\' \'unsafe-inline\''
      // }
    }
  },
  // Testing
  testing: {}
}

module.exports = webpackMerge(webpackConfig, webpackEnv[process.env.NODE_ENV]);
