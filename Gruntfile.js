'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    copy: {
      main: {
        files: [
          {expand: true, cwd: 'shared-assets', src: ['less/*.less'], dest: '../less'},
          {expand: true, cwd: 'shared-assets', src: ['_includes/*'], dest: '../_includes'},
          {expand: true, cwd: 'shared-assets', src: ['assets/*'], dest: '../assets'}
        ]
      }
    },

    paths: {
      lessSrc : 'less/main.less',
      lessDest: 'style.css',
      jsSrc: [
        'scripts/jquery-1.9.1.js',
        'scripts/jquery.jscroll-2.2.4.js',
        'scripts/tweet.js',
        'scripts/disqus-comment-count.js',
        'scripts/modernizr.custom.js',
        'scripts/app.js',
        'less/twitter-bootstrap/js/bootstrap-transition.js',
        'less/twitter-bootstrap/js/bootstrap-carousel.js'
      ],
      jsDest: 'script.js',
    },

    clean: {
      styleMap: ['style.css.map'],
      scriptMap: ['script.js.map']
    },

    // N.B. The most recent release of this Less plugin is not compatible with the version of
    // Twitter Bootstrap used in this project; as such an earlier version of the plugin is used
    less: {
      options: {
        paths: ['less']
      },
      development: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'style.css.map',
          outputSourceFiles: true
        },
        files: {
          '<%= paths.lessDest %>': '<%= paths.lessSrc %>'
        }
      },
      production: {
        options: {
          compress: true,
          ieCompat: true
        },
        files: {
          '<%= paths.lessDest %>': '<%= paths.lessSrc %>'
        }
      }
    },

    uglify: {
      development: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: true
        },
        files: {
          '<%= paths.jsDest %>': '<%= paths.jsSrc %>'
        }
      },
      production: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          '<%= paths.jsDest %>': '<%= paths.jsSrc %>'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['copy', 'styles', 'scripts']);
  grunt.registerTask('styles', ['clean:styleMap', 'less:production']);
  grunt.registerTask('scripts', ['clean:scriptMap', 'uglify:production']);

  grunt.registerTask('build:dev', ['styles:dev', 'scripts:dev']);
  grunt.registerTask('styles:dev', ['less:development']);
  grunt.registerTask('scripts:dev', ['uglify:development']);

  grunt.registerTask('default', ['build']);

};
