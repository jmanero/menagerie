var Package = require('auto-package');

Package.name('default-node-service');
Package.version_file();
Package.author('John Manero', 'john.manero@gmail.com');
Package.description('Nothing, really');

// Package.depends('bar', '2.x');
Package.github_repo('jmanero/default-node-service');

// Package.keyword('foo');
Package.license('MIT');

throw Error('This is a template. Go away.');
