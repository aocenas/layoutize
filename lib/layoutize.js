var jade = require('jade');
var _ = require('underscore');


// Default settings.
var defaults = {
  rowDelimiter : '|',
  columnDelimiter : ',',
  offsetChar : 'o',
  multiplier : 1,
  indent : 2,
  rowString : '.row',
  columnString : '.span',
  offsetString : '.offset'
};

var jadeOptions = {
  compileDebug : false,
  pretty : true
};

// Actual settings used through code. They are created when the layoutize() is
// called from defaults and optional options arg.
var settings;

/**
 * Main poblic API of the module. Function takes input and returns object from
 * which different forms of output can be retrieved.
 * 
 * Example: require('layoutize')('o3,2,2|o3,4').getHtml();
 * 
 * @method layoutize
 * @param {String} input Text input that will get parsed. Column is represented
 *                       by a number. If number is prefixed with 'o' then it
 *                       means offset. Column are delimited with ',' and rows
 *                       are delimited by '|'
 * @param {Object} options Options object to overide default settings.
 * @optional
 * @return {Object} Object containing parsed output and methods to generate
 *                  different output types.
 * 
 */
module.exports = exports = function (input, options) {
  if(options){
    settings = {};
    _.extend(settings, defaults, options);
  } else {
    settings = defaults;
  }
  var jadeString = transform(parse(input));
  return {
    jade : function () { return jadeString },
    html : function () { return jade.compile(jadeString, jadeOptions)() }
  }
};

// available formats
var formats = ['html', 'jade'];

/** 
 * Check if format is available.
 * 
 * @method available
 * @param {string} format
 * @return {boolean} Whether format exists or not
 */
exports.available = function (format) {
  return (_.indexOf(formats, format) > -1) ?  true : false; 
}

/** 
 * Return copy of formats array so it is not modifiable
 *
 * @method formats
 * @return {Array} Array of available formats
 */
exports.formats = function () {
  return _.clone(formats);
}

function indent (i){
  var ind = '';
  i = i * settings.indent;
  while(i--){
    ind += ' ';
  }
  return ind;
}

function getColumn (column, offset){
  return settings.columnString + column + 
    (offset ? settings.offsetString + offset : '');
}

// generate nested arrays
function parse (input){
  var rows = input.split(settings.rowDelimiter);
  rows = rows.map(function (row) {
    return row.split(settings.columnDelimiter);
  });
  return rows;
}

// create string output
function transform (rows){

  var output = '';
  var offset = false;
  var ind = 0;

  rows.forEach(function (row) {
    output += settings.rowString + '\n';
    ind++;
    row.forEach(function (column){
      if(column[0] === settings.offsetChar){
        offset = column.substring(1); 
      }else{
        output += indent(ind) + getColumn(column, offset) + '\n';
        offset = 0;
      }
    });
    ind--;
  });
  return output;
}



