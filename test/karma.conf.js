// para que lo stest no seen lentos, no minimizar las ventanas de chrome y mozilla
module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'bower_components/angular/angular.js',
      //'bower_components/angular-route/angular-route.js',
      //'bower_components/angular-resource/angular-resource.js',
      //'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-mocks/angular-mocks.js',
      //'dist/**/*.js',
      //'src/components/**/*.spec.js',
      //'src/core/**/*.spec.js'
      'src/components/**/*.js',
      'src/core/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers :  ['Chrome', 'Firefox'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};