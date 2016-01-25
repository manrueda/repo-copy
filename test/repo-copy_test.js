var test = require('tape');
var module = require('../src/repo-copy');
var path = require('path');

test('validateProgram - empty args', (t) => {
  var result = module.validateProgram({
    args: []
  });

  t.false(result);
  t.end();
});

test('validateProgram - compress without origin', (t) => {
  var result = module.validateProgram({
    compress: true,
    args: []
  });

  t.true(result instanceof Error);
  t.equal(result.message, 'Need to provide a repository path');

  t.end();
});

test('validateProgram - compress with origin', (t) => {
  var result = module.validateProgram({
    compress: true,
    args: ['../']
  });

  t.true(result);

  t.end();
});

test('validateProgram - copy without origin', (t) => {
  var result = module.validateProgram({
    copy: true,
    args: []
  });

  t.true(result instanceof Error);
  t.equal(result.message, 'Need to provide a repository path');

  t.end();
});

test('validateProgram - copy with origin and without output', (t) => {
  var result = module.validateProgram({
    copy: true,
    args: ['../']
  });

  t.true(result instanceof Error);
  t.equal(result.message, 'The output folder can\'t be founded');

  t.end();
});

test('validateProgram - copy with origin and bad output', (t) => {
  debugger;
  var result = module.validateProgram({
    copy: true,
    out: path.resolve(process.cwd(), 'package.json'),
    args: ['../']
  });

  t.true(result instanceof Error);
  t.equal(result.message, 'The output must be a folder');

  t.end();
});
