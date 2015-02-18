Menagerie
=======
A distributed, highly available resource directory service for your distributed, highly available platform.

## Model
Starting with the really abstract, the fundemental unit of Menagerie is a `Collection`. This is a named bucket of similar `Resources`. A `Resource` is a set of one or more versioned entities. Finally, each version may contain one or more instances.

In the case of a code artifact, that set will generally be length one; however, there may be cases where several different artifacts should be grouped in the same resource version (e.g. builds for multiple platforms). In the case of processes, a parallelized cluster is likely to have multiple instances of a resource at a given version.

```
Collections
+-Collection
| +-Resources
|   +-Resource
|   | +-Versions
|   |   +-Version
|   |   | +-Instance
|   |   | +-Instance
|   |   | ...
|   |   +-Version
|   |   ...
|   +-Resource
|   ...
+-Collection
...
```

## Indexers
Menagerie is a a lookup serivce. It doesn't populate any collections by default. Instead, indexer services crawl application-specific resoruce sets and use Menagerie's API to insert resources into a collection.

## Examples
* **Cookbooks**
[cookbook-menagerie] is an indexer for Chef cookbooks stored in a structured S3 bucket. It implements an interface that can be consumed by Berkshelf if you're into that...

```
/collections/cookbooks
+-/collections/cookbooks/apt
| +-/collections/cookbooks/apt/1.0.1
| | +-/collections/cookbooks/apt/1.0.1/cookbook.tgz
| +-/collections/cookbooks/apt/1.0.2
| | +-/collections/cookbooks/apt/1.0.2/cookbook.tgz
+-/collections/cookbooks/etcd
  +-/collections/cookbooks/etcd/2.2.1
  | +-/collections/cookbooks/etcd/2.2.1/cookbook.tgz
  +-/collections/cookbooks/etcd/2.2.2
    +-/collections/cookbooks/etcd/2.2.2/cookbook.tgz
```

* **EC2 Instances**
[cluster-menagerie] is an indexer for running processes. Unlike [cookbook-menagerie], [cluster-menagerie] runs with each instance of a process, either as a stand-alone daemon, or embedded in the target process. It announces it self to Menagerie for other processes to discover.

```
/collections/cluster
+-/collections/cluster/cassandra
| +-/collections/cluster/cassandra/1.0.1
| | +-/collections/cluster/cassandra/1.0.1/i-f00ba4
| | +-/collections/cluster/cassandra/1.0.1/i-f00ba5
| | +-/collections/cluster/cassandra/1.0.1/i-f00ba6
| +-/collections/cluster/cassandra/1.0.2
| | +-/collections/cluster/cassandra/1.0.1/i-f00bed
+-/collections/cluster/rabbitmq
  +-/collections/cluster/rabbitmq/2.2.1
  | +-/collections/cluster/rabbitmq/2.2.1/i-edf4ba
  | +-/collections/cluster/rabbitmq/2.2.1/i-22de1a
  +-/collections/cluster/rabbitmq/2.2.2
```

## API
* __GET__ _/collections_ Retrieve an array of collections
* __GET__ _/collections/:collection_ Get a whole collection
* __GET__ _/collections/:collection/:resource_ Get all versions of a resource
* __GET__ _/collections/:collection/:resource/:version_ Get a version (possibly multiple instances) of a resource
* __PUT__ _/collection/:collection_ Insert a resource into the collection
  * Query Parameters
    * _multiple=[true|False]_ Resource supports multiole instances of a given version. Optional; Default `false`.
    * _ttl=N_  Expirey, in seconds, for the instance. Optional, Default none.
  * Request Body
    
    ```
    {
      "name": "Resource Name (Required)",
      "version": "Resource Version (Required)",
      "instance": "Version Instance. Defaults to a UUID",
      ...
      "additional": "Parameters. Specific to the application"
    }
    ```

## License
The MIT License (MIT)

Copyright (c) 2015 John Manero <john.manero@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
