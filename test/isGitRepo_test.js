var test = require('tape');
var module = require('../src/repo-copy');
var path = require('path');

test('isGitRepo - null/empty/undefined path', (t) => {
  t.plan(3);

  module.isGitRepo().then((itIs) => {
    t.false(itIs);
  });

  module.isGitRepo('').then((itIs) => {
    t.false(itIs);
  });

  module.isGitRepo(null).then((itIs) => {
    t.false(itIs);
  });
});

test('isGitRepo - git path', (t) => {
  t.plan(1);

  module.isGitRepo(process.cwd()).then((itIs) => {
    t.true(itIs);
  });
});

test('isGitRepo - NO git path', (t) => {
  t.plan(1);

  module.isGitRepo(path.resolve(process.cwd(), 'src')).then((itIs) => {
    t.false(itIs);
  });
});
