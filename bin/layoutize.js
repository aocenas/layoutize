#!/usr/bin/env node

var layoutize = require('../');
var app = require('commander');
var fs = require('fs');

app
  .usage('[options]')
  .option('-F, --format <string>', 'format of the output, right now only ' +
                                    '"html" and "jade" are supported. if ' +
                                     'omitted, "jade" is the default')
  .option('-f, --file <file>', 'input file to be read. if omitted input is ' +
                                'read from stdin')
  .option('-i, --input <string>', 'direct input from commandline.')
  .option('-o, --output <file>', 'file where output is written. if omitted ' +
                                 'output is written to stdout.');

app.parse(process.argv);

var reader;
var parser;
var writer;

function readFromFile (file) {
  return function (callback) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) throw err
      else callback(data);
    });
  }
}

function readFromStdin (callback){
  var buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(chunk){ buf += chunk });
  process.stdin.on('end', function(){
    callback(buf);
  }).resume();
}

function readerFactory (file, input) {
  if (input) {
    return function (callback) { callback(input) };
  } else if (file) {
    return readFromFile(file);
  } else {
    return readFromStdin;
  }
}

function parserFactory (format){
  if (!format) {
    format = 'jade';
  }
  return function (callback) {
    return function (data) {
      callback(layoutize(data)[format]());
    }
  }
}

function writerFactory (file) {
  if (file) {
    return function (data) {
      fs.writeFile(file, data, 'utf8', function (err) {
        if (err) throw err;
      })
    }
  } else {
    return function (data) {
      process.stdout.write(data);
    }
  }
}

// input validation
function validate (app){
  if (app.input && app.file) {
    console.log('Only one of the flags [--input|--file] can be specified.');
    process.exit(1);
  }
  if (app.format && !layoutize.available(app.format)) {
    console.log('Format ' + app.format + ' is not supported');
    process.exit(1);
  }
}

validate(app);
reader = readerFactory(app.file, app.input);
parser = parserFactory(app.format);
writer = writerFactory(app.output);

// funny how those callbacks make sense this way
reader(parser(writer));

