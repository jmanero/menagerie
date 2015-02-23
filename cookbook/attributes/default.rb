#
# Cookbook Name:: menagerie
# Attributes:: default
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
include_attribute 'etcd::default'
include_attribute 'nodejs::default'

## etcd Install/Configuration
default['etcd']['trigger_restart'] = false
default['etcd']['listen'] = node['ipaddress'] unless default['etcd'].include?('listen')
default['etcd']['hostname'] = node['hostname'] unless default['etcd'].include?('hostname')
default['etcd']['user'] = 'etcd'
default['etcd']['group'] = 'etcd'
default['etcd']['version'] = '2.0.3'
default['etcd']['sha256'] = '0d4dd3ec5c3961433f514544ae7106676f313fe2fa7aa85cde0f2454f1a65b2f'
default['etcd']['addr'] = '0.0.0.0:2379'
default['etcd']['peer_addr'] = "#{ node['etcd']['listen'] }:2380"

## NodeJS Install
default['nodejs']['install_repo'] = false
default['nodejs']['packages'] = ['nodejs']

## Menagerie Install
default['menagerie']['source'] = '/vagrant'
