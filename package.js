Package = require('auto-package').scheme('1.0');

Package.name = 'menagerie';
Package.versionFile();
Package.author = 'John Manero <john.manero@gmail.com>';
Package.description = 'A distributed, highly available versioned resource directory service';

Package.depends('body-parser', '1.x');
Package.depends('express', '4.x');
Package.depends('libuuid', '0.1.x');
Package.depends('nconf', '0.7.x');
Package.depends('node-etcd', '3.0.x');
Package.depends('semver', '4.x');

Package.githubRepo('jmanero/menagerie');

Package.keyword('distributed');
Package.keyword('versioned');
Package.keyword('service');
Package.keyword('directory');

Package.license = 'MIT';
