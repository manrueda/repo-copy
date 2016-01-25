var test = require('tape');
var Promise = require('promise');
var module = require('../src/repo-copy');
var path = require('path');
debugger;
test('createCopy - null/empty/undefined path', (t) => {
  t.plan(3);
  var superTemp = '/temp/supertemp';
  var mockFiles = [
    'bin',
    'src',
    'package.json',
    'src/somefile.js'
  ];

  var generatedSource = [];
  var generatedTarget = [];

  module.mkdirPromise = (tempPath) => {
    t.equal(tempPath, superTemp);
    return Promise.resolve();
  }

  module.copyFile = (source, target) => {
    generatedSource.push(source);
    generatedTarget.push(target);

    return () => {
      return Promise.resolve();
    };
  };

  module.createCopy(process.cwd(), mockFiles, '/temp/supertemp').then(() => {
    t.deepEqual(generatedSource, [
      process.cwd() + '/bin',
      process.cwd() + '/src',
      process.cwd() + '/package.json',
      process.cwd() + '/src/somefile.js'
    ]);

    t.deepEqual(generatedTarget, [
      '/temp/supertemp/bin',
      '/temp/supertemp/src',
      '/temp/supertemp/package.json',
      '/temp/supertemp/src/somefile.js'
    ]);

  });
});
