/*
 * grunt-jsonschema
 * https://github.com/richistron/grunt-jsonschema
 *
 * Copyright (c) 2014 Ricardo Rivas G.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks


  grunt.registerMultiTask('jsonschema', 'Simple and fast JSON schema validator for grunt.', function() {

    var
    _,
    displayErrors,
    readFile,
    validateFile,
    get_validation_type,
    validate,
    Validator;

    _ = require('underscore');



    // function display errors
    displayErrors = function(v){
      if(v.errors.length !== 0){
        _.each(v.errors,function(error){
          grunt.log.warn('ERROR: ' + error.toString());
          _.each(error,function(e,name){
            grunt.log.warn(name + ': ' + e);
          });
        });
        return false;
      }
      return true;
    };

    // function readFile
    readFile = function(path){
      if(path === null || path === undefined){
        grunt.log.warn('path is not defined');
        return false;
      }
      if(typeof path !== 'string'){
        grunt.log.warn('path is not defined');
        return false;
      }
      if(!grunt.file.exists(path)){
        grunt.log.warn('path doesn not exists : ' + path);
        return false;
      }
      return JSON.parse(grunt.file.read(path));
    };

    validateFile = function(_file,_schema, refs){
      grunt.log.writeln('File: ' + _file);
      grunt.log.writeln('Schema: ' + _schema);

      var
      Validator,
      v,
      json,
      schema,
      validation;

      Validator = require('jsonschema').Validator;
      v = new Validator();
      json = readFile(_file);
      schema = readFile(_schema);

      // complex schema
      if (refs && refs.length) {
        refs.forEach(function(ref){
          grunt.log.writeln('Ref: ' + ref);
          var schemaTemplate = readFile(ref);
          v.addSchema(schemaTemplate, schemaTemplate.id);
        });
      }

      validation = v.validate(json, schema);
      displayErrors(validation);
    };

    get_validation_type = function(options){
      var type;
      if (typeof options.file === 'string' && typeof options.schema === 'string') {
        type = 'single_file';
      }
      if (!options.file && options.files && options.files.length && !options.schema) {
        type = 'multiple_files_multiple_schemas';
      }
      if (typeof options.schema === 'string' && options.files && options.files.length && !options.file) {
        type = 'multiple_files_one_schemas';
      }
      if (typeof options.file === 'string' && options.schema && options.schema.main && options.schema.refs && options.schema.refs.length) {
        type = 'one_file_one_schema';
      }
      if (options.files && options.files.length && options.schema && options.schema.main && options.schema.refs && options.schema.refs.length) {
        type = 'multiple_files_complex_schema';
      }
      return type;
    };

    // function validate
    validate = function(o){
      if(o.files === null && o.file === null){
        grunt.log.warn('\'files\' or \'files\' properties can not be emtpy.');
        grunt.log.warn('readmore: https://github.com/richistron/grunt-jsonschema');
        return false;
      }

      grunt.log.writeln(['Valitation Type: ' + get_validation_type(o)]);

      if (get_validation_type(o) === 'single_file') {
        validateFile(o.file, o.schema);
        return true;
      }

      if (get_validation_type(o) === 'multiple_files_multiple_schemas') {
        o.files.forEach(function(item){
          validateFile(item.file, item.schema);
        });
        return true;
      }

      if (get_validation_type(o) === 'multiple_files_one_schemas') {
        o.files.forEach(function(item){
          validateFile(item, o.schema);
        });
        return true;
      }

      if (get_validation_type(o) === 'one_file_one_schema') {
        validateFile(o.file, o.schema.main, o.schema.refs);
        return true;
      }

      if (get_validation_type(o) === 'multiple_files_complex_schema') {
        o.files.forEach(function(item){
          validateFile(item, o.schema.main, o.schema.refs);
        });
        return true;
      }
      
      return false;
    };

    return validate(_.extend({
      files: null,
      file: null,
      schema: null
    },this.options()));

  });

};
