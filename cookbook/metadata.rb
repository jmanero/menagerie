name 'menagerie'
maintainer 'John Manero'
maintainer_email 'john.manero@gmail.com'
description 'Menagerie deployment cookbook'

license IO.read('../LICENSE') rescue 'MIT'
long_description IO.read('../README.md') rescue ''
version IO.read('../VERSION') rescue '0.0.1'

depends 'apt'
depends 'etcd'
depends 'nodejs'
