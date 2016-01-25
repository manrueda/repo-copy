var test = require('tape');
var module = require('../src/repo-copy');
var path = require('path');

test('getFiles - this repository', (t) => {

  module.getFiles(process.cwd()).then((files) => {
    t.true(files instanceof Array);
    t.notEqual(files.length, 0);

    t.notEqual(files.indexOf('bin'), -1);
    t.notEqual(files.indexOf('src'), -1);
    t.notEqual(files.indexOf('package.json'), -1);

    t.equal(files.indexOf('node_modules'), -1);
    t.equal(files.indexOf('coverage'), -1);

    t.end();
  });
});
