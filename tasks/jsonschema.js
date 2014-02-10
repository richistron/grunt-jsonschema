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

    // function validate
    validate = function(o){
      // grunt.log.write('options:',o);
      var
      Validator,
      v,
      json,
      schema,
      validation,
      path;

      Validator = require('jsonschema').Validator;
      v = new Validator();

      if(o.files === null && o.file === null){
        grunt.log.warn('\'files\' or \'files\' properties can not be emtpy.');
        grunt.log.warn('readmore: https://github.com/richistron/grunt-jsonschema');
        return false;
      }

      if(typeof o.file === 'string' && typeof o.schema === 'string'){
        grunt.log.write('valitation type: single');
        json = readFile(o.file);
        schema = readFile(o.schema);
        validation = v.validate(json, schema);
        displayErrors(validation);
        return true;
      }

      if(typeof o.files === 'array' && o.files !== null && typeof o.schema !== 'string'){
        grunt.log.write('valitation type: multiple files and multiple schemas');
        _.each(o.files,function(item){
          json = readFile(item.file);
          schema = readFile(item.schema);
          validation = v.validate(json, schema);
          displayErrors(validation);
        });
        return true;
      }

      if(typeof o.files === 'object' && o.files !== null && typeof o.schema === 'string'){
        grunt.log.write('valitation type: multiple files one schema');
        _.each(o.files,function(item){
          json = readFile(item);
          schema = readFile(o.schema);
          validation = v.validate(json, schema);
          displayErrors(validation);
        });
        return true;
      }


      if(typeof o.schema === 'object' && o.file !== null){
        grunt.log.write('valitation type: one file complex schema');
        path = o.file;
        json = readFile(path);
        schema = readFile(o.schema.main);
        if(o.schema.refs !== undefined && o.schema.refs !== null){
          _.each(o.schema.refs,function(ref){
            var schemaTemplate = readFile(ref);
            v.addSchema(schemaTemplate, schemaTemplate.id);
          });
        }else{
          grunt.log.warn('options.schema.refs is not defined');
          return false;
        }
        validation = v.validate(json, schema);
        displayErrors(validation);
        return true;
      }

      if(typeof o.schema === 'object' && o.files !== null){
        grunt.log.write('valitation type: multiple files complex schema');
        _.each(o.files,function(file){
          path = file;
          json = readFile(path);
          schema = readFile(o.schema.main);
          if(o.schema.refs !== undefined && o.schema.refs !== null){
            _.each(o.schema.refs,function(ref){
              var schemaTemplate = readFile(ref);
              v.addSchema(schemaTemplate, schemaTemplate.id);
            });
          }else{
            grunt.log.warn('options.schema.refs is not defined');
            return false;
          }
          validation = v.validate(json, schema);
          displayErrors(validation);
        });
        return true;
      }

    };

    return validate(_.extend({
      files: null,
      file: null,
      schema: null
    },this.options()));

  });

};
