module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    
    sass: {
      dist: {
        files: {
          'flashcard/css/addcourse.css' : 'flashcard/css/sass/addcourse.scss',
          'flashcard/css/bookblock.css' : 'flashcard/css/sass/bookblock.scss',
          'flashcard/css/custom.css' : 'flashcard/css/sass/custom.scss',
          'flashcard/css/style.css' : 'flashcard/css/sass/style.scss',
          'flashcard/css/demo.css' : 'flashcard/css/sass/demo.scss'
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },


    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }, 
    watch:{
      sass:{
        files: ['flashcard/css/sass/*.scss','<%= jshint.files %>'],
        tasks: ['sass'],

      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'watch']);

};