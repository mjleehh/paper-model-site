module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "dev/styles/css/styles.min.css": "dev/styles/less/styles.less"
        }
      }
    },
    concat: {
      css: {
        src: [
          'dev/styles/css/*.css'
        ],
        dest: 'dev/styles/css/concat/styles_concat.css'
      },
      js: {
        src: [
          'dev/js/site.js'
        ],
        dest: 'dev/js/concat/site_concat.js'
      }
    },
    cssmin: {
      css: {
        src: 'dev/styles/css/concat/styles_concat.css',
        dest: 'build/styles/styles.min.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dev/js/concat/site_concat.js',
        dest: 'build/js/site.min.js'
      }
    },
    watch: {
      less: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['dev/styles/less/*.less'],
        tasks: ['less'],
        options: {
          spawn: false
        }
      },
      concat: {
          files: ['dev/styles/css/*', 'dev/js/*'],
          tasks: ['concat'],
          options: {
              spawn: false
          }
      },
      uglify: {
          files: ['dev/js/concat/site_concat.js'],
          tasks: ['uglify'],
          options: {
              spawn: false
          }
      },
      cssmin: {
          files: ['dev/styles/css/concat/styles_concat.css'],
          tasks: ['cssmin'],
          options: {
              spawn: false
          }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};
