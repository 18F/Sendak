### Sendak, or Infrastructure-as-a-service-as-a-service

Sendak's primary purpose in life is to manage the cloud provisioning process for medium-to-large organisations. With Sendak, users become associated with groups in IAM as well as with software projects on GitHub (or other git repositories); by their association with software projects it is possible to see which ec2 machines a user is nominally (although there is no hard link) associated with.

These projects are typically associated with a Virtual Private Cloud (VPC), allowing users within that project to have super-user-ish powers over assets that are specific to their project, while not requiring greater access to the assets under the larger realm of the AWS account under management.

Additionally, Sendak allows us to better manage onboarding of users and verification of, for example, their use of multifactor authentication (MFA).

Lastly, Sendak allows operators to, from the command-line, bring up new EC2 instances with software via git and automatically deploy these in a way that is consistent, repeatable, and assumedly as safely as when the project was tagged and committed. This last process is "pluggable," and could be as simple as patching `/etc/hosts` to include the names/addresses of its neighbors, or as complex as joining a database cluster, running an automated build/test procedure, or basically anything else that can be executed over `ssh`. The documentation for this "pluggability" is in the `bin/` directory.



[@avriette](https://github.com/avriette), jane.avriette@gsa.gov

#### What is all this stuff?

* `bin` - separated out by language; these are called by the sendak dispatcher, so something that is called `bin/js/build-node.js` would be invoked by `sendak build-node --long-arg param` and similar. All these tasks take `--long-arguments` to include `--help` (and are quite helpful, so&hellip;)

* `components` - this directory is broken out by functionality and language; the Riak interface for Sendak's javascript components live in `components/common/js/riak-dc.js`; the Sendak deploy libraries that use Fabric live in `components/python/fabfile.py`, et cetera. These should (generally) not be executables but rather libraries/shared code. An executable only belongs in the `components/` directory if it is responsible for maintaining that component (such as a database initialisation script for the data store).

* `doc` - contains various and sundry documentation and artifacts related to development of Sendak. To be substantially cleaned-up and presentable-made.

* `etc` - config files, keys, and similar. Most (all?) of this is not checked in to git.

* `mockups` - “wireframes” and similar pieces of code designed to demonstrate a functionality or what something would look like If It Really Worked™. None of these should ever be considered functional, safe, or production-ready. If you find yourself using something here more than once, please clean it up and place it in `bin/`. Eventually this is to become an `examples/` directory.

* `contrib` - these things are helpful but not really "officially part of the sendak distribution." If you have something that would be useful to Sendak users, this is the place to add it and submit a PR.

* `var` - as per Unix convention your runtime files go here.

#### Installing a suitable environment for Sendak

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

#### Installation

1. For the moment, simply pulling Sendak down from GitHub with `git clone git@github.com:18F/Sendak.git sendak` will give you everything you need but the prerequisites and AWS credentials.
2. It is advisable to have the `aws-cli` package from Amazon installed. On a Mac, this is `brew install awscli`. On Ubuntu, you will want `apt-get install awscli`.
3. You will need the secret key and the api key from your Amazon account. This is available from the Amazon IAM page. You will need to put this in `~/.aws/config`, as sendak reads its stuff from there (a secret key and access key is available, but difficult to find, in the AWS console).
4. Your environment will contain various shell variables for configuration's sake; these are defined in `contrib/bash_env.sh`. Each variable is defined with a comment in that file.
5. Once you have the credentials and environment configured, and your javascript and python packages installed, you should be able to begin using sendak by issuing `sendak --help` and similar. There is a `sendak --list-tasks` command that will show you the available tasks. At present this does not report on their suitability at all and merely indicates their presence in the `bin/` tree.

#### What's a Sendak?

From Wikipedia:

**Maurice Bernard Sendak** (/ˈsɛndæk/; June 10, 1928 – May 8, 2012) was an American illustrator and writer of children's books. He became widely known for his book *Where the Wild Things Are*, first published in 1963. Born to Jewish-Polish parents, his childhood was affected by the death of many of his family members during the Holocaust. Besides *Where the Wild Things Are*, Sendak also wrote works such as *In the Night Kitchen* and *Outside Over There*, and illustrated *Little Bear*.

The progenitor of this software was called Thing Launcher (see `doc/artifacts/prior_art`), which was developed at CFPB.

Sendak, you see, keeps track of the Wild Things for devops.
