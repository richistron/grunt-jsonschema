/*
 * grunt-jsonschema
 * https://github.com/richistron/grunt-jsonschema
 *
 * Copyright (c) 2014 Ricardo Rivas G.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    jsonschema: {
      single_file:{
        options: {
          file: 'test/files/person.json',
          schema: 'test/schemas/person.json'
        }
      },
      multiple_files_multiple_schemas:{
        options: {
          files: [
            {
              file: 'test/files/person.json',
              schema: 'test/schemas/person.json'
            },
            {
              file: 'test/files/posts.json',
              schema: 'test/schemas/posts.json'
            }
          ]
        }
      },
      multiple_files_one_schemas: {
        options: {
          schema: 'test/schemas/person.json',
          files: [
            'test/files/person.json',
            'test/files/person2.json'
          ]
        }
      },
      one_file_one_schema: {
        options: {
          file: 'test/files/person.json',
          schema: {
            main: 'test/schemas/person_ref.json',
            refs: [
              'test/schemas/address.json'
            ]
          }
        }
      },
      multiple_files_complex_schema: {
        options: {
          files: [
            'test/files/person.json',
            'test/files/person2.json'
          ],
          schema: {
            main: 'test/schemas/person_ref.json',
            refs: [
              'test/schemas/address.json'
            ]
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jsonschema', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
