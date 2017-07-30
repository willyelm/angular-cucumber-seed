const webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-spec-reporter'),
      require('karma-sourcemap-loader')
    ],
    client:{
      clearContext: false
    },
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': [ 'webpack','sourcemap' ]
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: webpackConfig.stats
    },
    reporters: ['spec'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
