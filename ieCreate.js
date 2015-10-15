/*
*
* grunt-ieCreate
* https://github.com/gallor/grunt-iecreate
*
* Copyright (c) 2015 Grant Allor
* Licensed under the MIT license.
*/

'use strict';

module.exports = function(grunt) {

    var fs = require('fs');
    var path = require('path');
    var _ = require('lodash');

    function ensureConfig(config, file) {
        if(!file[config]) {
            throw new Error(config + ' configuration is required');
        }
    }

    function ensureSrc(file) {
        ensureConfig('src', file);
    }

    function ensureDest(file) {
        ensureConfig('dest', file);

        if(typeof file.dest !== 'string') {
            throw new Error('only a single destination is allowed');
        }
    }

    function ensureDestFile(destFile) {
        ensureConfig('destFile', destFile);

        if(typeof destFile['destFile'] !== 'string') {
            throw new Error('only one single destination file is allowed');
        }
    }

    function createImport(options, filePath) {
        return options['addedText'] + path.basename(filePath) + '\';';
    }

    function writeToFile(options, filenames) {


        var regex = new RegExp(options['destFile']);

        var directory = fs.readdirSync(options['dest']);
        var ieDest = _.filter(directory, function(f) {
            return regex.test(f);
        });

        grunt.file.write(options['dest'] + ieDest, filenames.join(" "));


    }

    grunt.task.registerMultiTask('ieCreate', 'Create IE stylesheet from split css files', function() {

        var defaultOptions = {
            addedText: '@import \'./'
        };

        var options = !! this.data.options ? _.extend(defaultOptions, this.data.options) : defaultOptions;

        // Iterate over all specified file groups

        this.files.forEach(function(file) {
            ensureSrc(file);
            ensureDest(file);
            ensureDestFile(options);

            var opts = _.extend({dest: file.dest}, options);

            writeToFile(opts, file.src.map(createImport.bind(this, opts)));
        });





    });
};
