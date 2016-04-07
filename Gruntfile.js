'use strict';
module.exports = function(grunt) {

  var d = new Date();

  var globalConf = {
    ruta_dist: './dist/',
    ruta_dist_dev: './dev/',
    version: 'jg-tools-0.2.0-alpha-2'
  };


  // copia los css y js generados en al carpeta desarrollo

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    globalConfig: globalConf,
    watch: {
      sass: {
        files: ['src/skin/**/*.scss', 'src/components/**/*.scss', 'src/style/**/*.scss'],
        tasks: ['sass', 'copy:dev']
      },
      js: {
        files: ['src/components/**/*.cjg.js', 'src/core/**/*.cjg.js', 'src/plugins/**/*.js'],
        tasks: ['concat:app_js', 'copy:dev']
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '.tem/skin-1/all.css': 'src/skin/skin-1/all.scss',
          '.tem/skin-1/core.css': 'src/skin/skin-1/core.scss',
          '.tem/skin-1/layout.css': 'src/skin/skin-1/layout.scss',
          '.tem/skin-1/menu.css': 'src/skin/skin-1/menu.scss',
          '.tem/skin-1/menu-horizontal.css': 'src/skin/skin-1/menu-horizontal.scss',
          '.tem/skin-1/tool-bar.css': 'src/skin/skin-1/tool-bar.scss',
          '.tem/skin-1/card.css': 'src/skin/skin-1/card.scss',
          //'.tem/css/skin-1.css':'app/sass/skin/skin-1.scss',
          //'.tem/css/font-md.css':'app/sass/font-md.scss'
        }
      }
    },
    cssmin: {
      my_target: {
        files: [{
          expand: true,
          cwd: '.tem/skin-1',
          src: ['*.css', '!*.min.css'],
          dest: '<%= globalConfig.ruta_dist  %><%= globalConfig.version  %>/skin-1',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      options: {

      },
      my_target: {
        files: {
          '<%= globalConfig.ruta_dist  %><%= globalConfig.version  %>/jg-tools.min.js': [
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            '.tem/js/jg-tools.js'
          ],
          '<%= globalConfig.ruta_dist  %><%= globalConfig.version  %>/jsapi.min.js': [
            '.tem/js/jsapi.js'
          ],
        }
      }
    },
    concat: {
      app_js: {
        options: {
          seperator: ";"
        },
        files: {
          '.tem/js/jg-tools.js': ['src/core/**/*.cjg.js', 'src/components/**/*.cjg.js'],
          '.tem/js/jsapi.js': ['src/plugins/jsapi/jsapi.js'],
        }
      }
    },
    jshint: {
      options: {
        "bitwise": true,
        "browser": true,
        "curly": true,
        "eqeqeq": true,
        "esnext": true,
        "latedef": true,
        "noarg": true,
        "node": true,
        "strict": true,
        "undef": true,
        "unused": true,
        "globals": {
          "angular": true
        },
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          '.tem/app.js', '.tem/app.min.js'
        ]
      },
      unit: {
        src: [
          'src/core/**/*.cjg.js', 'src/components/**/*.cjg.js'
        ]
      }
    },
    clean: {
      dist: {
        options: {
          force: true,
        },
        files: [{
          dot: true,
          src: [
            '<%= globalConfig.ruta_dist  %>', '.tem'
          ]
        }]
      },
      dev: {
        options: {
          force: true,
        },
        files: [{
          dot: true,
          src: [
            '<%= globalConfig.ruta_dist_dev  %>', '.tem'
          ]
        }]
      },
      tem: {
        options: {
          force: true,
        },
        files: [{
          dot: true,
          src: [
            '.tem'
          ]
        }]
      },
    },
    copy: {
      dist: {
        files: [
          // includes files within path
          //{expand: true,flatten: true, src: ['bower_components/components-font-awesome/fonts/*'], dest: '<%= globalConfig.ruta_dist  %>fonts', filter: 'isFile'},
          {
            expand: true,
            flatten: true,
            src: ['<%= globalConfig.ruta_dist  %><%= globalConfig.version  %>/*'],
            dest: '<%= globalConfig.ruta_dist  %>current/',
            filter: 'isFile'
          }, {
            expand: true,
            flatten: true,
            src: ['<%= globalConfig.ruta_dist  %><%= globalConfig.version  %>/skin-1/*'],
            dest: '<%= globalConfig.ruta_dist  %>current/skin-1',
            filter: 'isFile'
          },
          //{expand: true,flatten: false, cwd: '.tem/css/',src: 'skin-1.min.css',dest: '<%= globalConfig.ruta_dist  %>css'}
        ],
      },
      dev: {
        files: [
          // includes files within path
          {
            expand: true,
            flatten: true,
            src: ['.tem/skin-1/*'],
            dest: '<%= globalConfig.ruta_dist_dev  %>skin-1/',
            filter: 'isFile'
          }, {
            expand: true,
            flatten: true,
            src: ['.tem/js/*'],
            dest: '<%= globalConfig.ruta_dist_dev  %>',
            filter: 'isFile'
          }, {
            expand: true,
            flatten: true,
            src: ['./bower_components/angular/*'],
            dest: '<%= globalConfig.ruta_dist_dev  %>plugins/angular',
            filter: 'isFile'
          }, {
            expand: true,
            flatten: true,
            src: ['./bower_components/angular-ui-router/release/*'],
            dest: '<%= globalConfig.ruta_dist_dev  %>plugins/angular-ui-router',
            filter: 'isFile'
          }, {
            expand: true,
            flatten: true,
            src: ['./bower_components/angular-bootstrap/*'],
            dest: '<%= globalConfig.ruta_dist_dev  %>plugins/angular-bootstrap',
            filter: 'isFile'
          },

        ],
      },
      bw: {
        files: [
          // includes files within path
          //{expand: true,flatten: true, src: ['bower_components/angular/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-animate/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-animate', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-touch/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-touch', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-messages/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-messages', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-aria/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-aria', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-resource/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-resource', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-route/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-route', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-ui-router/release/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-ui-router', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-material/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-material', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/material-design-icons/iconfont/*'], dest: '<%= globalConfig.ruta_dist_dev  %>font/material-design-icons', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/jquery/dist/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/jquery', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-ui-mask/dist/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-ui-mask', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/bootstrap/dist/css/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/bootstrap/css', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/bootstrap/dist/fonts/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/bootstrap/fonts', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/bootstrap/dist/js/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/bootstrap/js', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/font-awesome/css/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/font-awesome/css', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/font-awesome/fonts/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/font-awesome/fonts', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['plugins/toolsjj/2.0.1/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/toolsjj/', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['bower_components/angular-bootstrap/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/angular-bootstrap', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['../js/jtools/jtools-jsapi/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/jtools/jsapi', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['../js/jtools/jtools-service-angularjs/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/jtools/service-angularjs', filter: 'isFile'},
          //{expand: true,flatten: true, src: ['../js/jtools/jtools-google-chart-angularjs/*'], dest: '<%= globalConfig.ruta_dist_dev  %>plugin/jtools/google-chart-angularjs', filter: 'isFile'},
        ],
      },
    },
    purifycss: {
      options: {},
      target: {
        src: ['docs/plugins/google/lista.html'],
        css: ['docs/plugins/google/lista-btn.css'],
        dest: 'docs/plugins/google/lista-btn.spy.css'
      },
    },
  });



  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-purifycss');

  grunt.registerTask('pfycss', [
    'purifycss',
  ]);

  grunt.registerTask('lint', [
    'jshint:unit', // verifica la sintaxis en cada archivo js de lacarpeta app/js
  ]);

  grunt.registerTask('build', [

    //'jshint:unit',        // verifica la sintaxis en cada archivo js de lacarpeta app/js

    'clean:dist', // borra todo los archivos del public/f

    'concat:app_js', // une todos los archivos de la carpeta app/js
    'uglify', // minimiza el archivo temporal 
    //'jshint',             // revisa todo la sintaxis js
    //'concat:dist_js',     // genera un archivo unico de distribucion


    'sass', // compila el sass y lo copia dentro de la carpeta css 
    'cssmin', // minimiza el archivo temporal
    //'concat:dist_css',    // genera un archivo unico de distribucion

    'copy:dist' // copia las fuentes que sean necesarias en produccion
  ]);

  grunt.registerTask('default', [
    //'clean:tem',
    'clean:dev', // borra todo los archivos del public/f
    //'copy:bw',            // copia todos los archivos generados por bower en al carpeta desarrollo

    'sass', // compila el sass y lo copia dentro de la carpeta css 
    'concat:app_js', // une todos los archivos de la carpeta app/js
    'copy:dev', // copia los css y js generados en al carpeta desarrollo

    'watch' // se pone a escuchar posibles cambios en los archivos
  ]);


};

/**
* modo desarrollo y produccion
** grunt :   borra los temporales y copia los archivos en diferentes carpetas para que se pueda testear,
            constantemente esta escuchando cambios en el js o css y los copia los archivos cambiados
** grunt lint : revisa la sintaxis de los archivos js
** grunt built : genera los archivos compilados y minificados de js y css. 
*/