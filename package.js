var Package = require('auto-package');

Package.name('menagerie');
Package.version_file();
Package.author('John Manero', 'john.manero@gmail.com');
Package.description('A distributed, highly available resource directory service');

Package.depends('aws-sdk', '2.1.x');
Package.depends('nconf', '0.7.x');
Package.depends('node-etcd', '3.0.x');

// "async": "0.9.x",


Package.github_repo('jmanero/menagerie');

Package.keyword('distributed');
Package.keyword('service');
Package.keyword('directory');
Package.keyword('versioning');

Package.license('MIT');
