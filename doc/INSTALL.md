Installing a suitable environment for Sendak
====

For Sendak's JavaScript components, just `npm install`, and that should build you a sufficiently useful `node_modules` directory. Be sure to set `$NODE_PATH`.

For Python (version 2.7):

* Fabric

To install Fabric, `pip install fabric` should do the trick.

If you generally use Python 3.X in your work, you may find it useful to create a virtualenv with Python 2.7 inside it (perhaps called `fab`), just for running Fabric commands.

As discussed in the previous section, you will find libraries for use in both languages under `components/common/`.

##### Sendak uses Riak.

18F does not have a containerised Riak installation, and Basho only sort-of offers this without commercial support. The installation they offer for Ubuntu is `https://packagecloud.io/install/repositories/basho/riak/script.deb | sudo bash`. You will probably want to look at `script.deb` before running this of course.

After installation, add 'ulimit -n 65535' to `/etc/default/riak`.

In a Mac environment, you can issue `brew install riak`, which mostly does the right thing.

You will need to issue `ulimit -n 4096` in order for it to stay running. It will probably consume lots of CPU and you may find it is not especially useful to have a Riak on your laptop. Jane has found it is easier to run Riak on a properly sized instance in Amazon, and then run an ssh tunnel out to Amazon.

In your `~/.ssh/config` this might look like:

```
Host infdb
  HostName infdb.18f.us
  ControlMaster auto
  ControlPath /tmp/ssh-%r@%h:%p
  LocalForward 8098 127.0.0.1:8098
  User jane
```

Installation
====

1. For the moment, simply pulling Sendak down from GitHub with `git clone git@github.com:18F/Sendak.git sendak` will give you everything you need but the prerequisites and AWS credentials.
2. It is advisable to have the `aws-cli` package from Amazon installed. You can install this through the Python package manager with `pip install awscli`.
3. You will need the secret key and the api key from your Amazon account. This is available from the Amazon IAM page. You will need to put this in `~/.aws/config`, as sendak reads its stuff from there (a secret key and access key is available, but difficult to find, in the AWS console).
4. Your environment will contain various shell variables for configuration's sake; these are defined in `contrib/bash_env.sh`. Each variable is defined with a comment in that file.
5. Once you have the credentials and environment configured, and your javascript and python packages installed, you should be able to begin using sendak by issuing `sendak --help` and similar. There is a `sendak --list-tasks` command that will show you the available tasks. At present this does not report on their suitability at all and merely indicates their presence in the `bin/` tree.
