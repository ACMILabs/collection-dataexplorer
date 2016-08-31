//
//  ACMI Helper 
//
//  Helper functions for ACMI Collection Data Explorer
//
// Uses UMD boilerplate: https://github.com/umdjs/umd/blob/master/templates/commonjsStrictGlobal.js

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'b'], function (exports, b) {
            factory((root.commonJsStrictGlobal = exports), b);
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('b'));
    } else {
        // Browser globals
        factory((root.acmiHelper = {}), root.b);
    }
}(this, function (exports, b) {
    // return string of first value in comma separated values, passed in by string
    exports.getFirstComma = function(stringToCheck) {
      if (typeof stringToCheck !== 'undefined')
        return stringToCheck.split(", ")[0].toLowerCase();
    };
    // return fist value in an array
    exports.getFirst = function(arrayToCheck) {
      if (typeof arrayToCheck !== 'undefined')
        return arrayToCheck[0];
    };    
    // return array of all values from semicolon separated values, passed in by string
    exports.getAllSemicolon = function(stringToCheck) {
      if (typeof stringToCheck !== 'undefined')
        return stringToCheck.split("; ");
    };
    // check that the passed in value exists
    exports.checkExists = function(value) {
      if (typeof value !== 'undefined')
        return !!value;
    };
    // return lowercase string, words separated by underscores
    exports.toUnderscore = function(value) {
      if (typeof value === 'string' && value != null) {
        var newArray = value.match(/\w+/g);
        if (newArray != null) {
          if (newArray.length > 0) { 
            return newArray.join("_").toLowerCase();
          }
        }
      }
    };
    // Parse a time string (HMS) as minutes.
    // Expects length in the format 00:00:00 - hours, minutes, seconds
    exports.parseLength = function(titleLength) {
      if (typeof titleLength !== 'undefined') {
        var newString = false;
        var hms = titleLength.split(":");
        if (hms.length == 3) {
          try {
            newString = parseInt(hms[0]) > 0 ? parseInt(hms[1]) + parseInt(hms[0]) * 60 : parseInt(hms[1]);
          }
          catch(err) {
            newString = false;
          }
        }
        return newString;
      }
    };

}));