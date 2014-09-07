# grunt-jsonschema v0.0.4
[![npm version](http://img.shields.io/npm/v/grunt-jsonschema.svg)](https://www.npmjs.org/package/grunt-jsonschema)
[![Build Status](https://travis-ci.org/richistron/grunt-jsonschema.png?branch=master)](https://travis-ci.org/richistron/grunt-jsonschema)
[![Node Dependencies](https://david-dm.org/richistron/grunt-jsonschema.png)](https://david-dm.org/richistron/grunt-jsonschema)

> Simple and fast JSON schema validator for grunt.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jsonschema --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jsonschema');
```

## The "jsonschema" task

### Overview
In your project's Gruntfile, add a section named `jsonschema` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jsonschema: {
    options: {
      file: 'test/files/person.json',
      schema: 'test/schemas/person.json'
    }
  }
});
```

### Options

#### options.file
Type: `String`
Default value: `null`

path to json file that wants to be validated.

#### options.schema
Type: `String`
Default value: `null`

jsonschema path.

### Single File

```js
grunt.initConfig({
  jsonschema: {
    all:{
      options: {
        file: 'test/files/person.json',
        schema: 'test/schemas/person.json'
      }
    }
  }
});
```

### Multiple Files and multiple schemas

```js
grunt.initConfig({
  jsonschema: {
    all:{
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
    }
  }
});
```

### Multiple Files one schema

```js
grunt.initConfig({
  jsonschema: {
    all:{
      options: {
        schema: 'test/schemas/person.json',
        files: [
          'test/files/person.json',
          'test/files/person2.json'
        ]
      }
    }
  }
});
```

### One file and Complex Schema

```js
grunt.initConfig({
  jsonschema: {
    all:{
      options: {
        file: 'test/files/person.json',
        schema: {
          main: 'test/schemas/person_ref.json',
          refs: [
            'test/schemas/address.json'
          ]
        }
      }
    }
  }
});
```

### Multiple files and Complex Schema

```js
grunt.initConfig({
  jsonschema: {
    all:{
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
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v0.0.4 -> Sunday, September 7, 2014 | [Release notes](https://github.com/richistron/grunt-jsonschema/pull/7)
