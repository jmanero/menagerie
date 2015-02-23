#
# Cookbook Name:: menagerie
# Recipe:: default
#
# The MIT License (MIT)
# =====================
# _Copyright (C) 2015 John Manero <john.manero@gmail.com>_
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

include_recipe 'apt::default'
apt_repository 'nodejs' do
  uri 'ppa:chris-lea/node.js'
  distribution node['lsb']['codename']
end

## etcd Configuration
group node['etcd']['group'] { system(true) }
user node['etcd']['user'] do
  gid node['etcd']['group']
  home ::File.dirname(node['etcd']['state_dir'])
  shell '/usr/sbin/nologin'
  system true
end

directory node['etcd']['state_dir'] do
  owner node['etcd']['user']
  group node['etcd']['group']
  recursive true
end

include_recipe 'etcd::binary_install'
include_recipe 'etcd::_service'

## Set permissions for etcd's home
resources(:directory => ::File.dirname(node['etcd']['state_dir'])).tap do |resource|
  resource.owner(node['etcd']['user'])
  resource.group(node['etcd']['group'])
end

## Use our own etcd upstart template for etcd 2.0.x
resources('template[/etc/init/etcd.conf]').tap do |resource|
  resource.cookbook('menagerie')
  resource.source('etcd.upstart.erb')
end

## NodeJS and module dependencies
include_recipe 'nodejs::nodejs'
package 'build-essential'
package 'uuid-dev'

## TODO Fetch source

nodejs_npm 'install' do
  path node['menagerie']['source']
  json true
  notifies :start, 'service[menagerie]'
end

template '/etc/init/menagerie.conf' do
  source 'menagerie.upstart.erb'
end

service 'menagerie' do
  action [:start, :enable]
end

## Toggle ETCd restarts
first_run_complete = ::File.join(Chef::Config['cache_path'], 'first_run_complete')
file(first_run_complete) { action :touch }

node.default['etcd']['trigger_restart'] = ::File.exist(first_run_complete) rescue false
Chef::Log.info("etcd service restart #{ node['etcd']['trigger_restart'] ? 'enabled' : 'disabled' }")
