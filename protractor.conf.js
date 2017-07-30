// const { SpecReporter } = require('jasmine-spec-reporter');
const { register } = require('ts-node')

exports.config = {
  allScriptsTimeout: 11000,
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:8080/',
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    require: [
      'e2e/**/*.steps.ts'
    ],
    format: 'pretty'
  },
  specs: [
    'e2e/**/*.feature'
  ],
  SELENIUM_PROMISE_MANAGER: false,
  beforeLaunch () {
    register({
      project: 'e2e/tsconfig.e2e.json'
    });
  }
};
