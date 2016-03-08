module.exports = function(config) {
  config.set({
    basePath : '../',

    //reporters: ['junit'],

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    // junitReporter : {
    //   outputDir: "test_result",
    //   outputFile: 'test_out/unit.xml',
    //   suite: 'unit'
    // }

  });
};
