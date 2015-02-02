name 'node-service'
maintainer 'John Manero'
maintainer_email 'john.manero@gmail.com'
description 'Template for cookbooks'

license IO.read('../LICENSE') rescue 'MIT'
long_description IO.read('../README.md') rescue ''
version IO.read('../VERSION') rescue '0.0.1'

depends 'apt'

fail 'This cookbook is a template. It has no executable functionality!'
