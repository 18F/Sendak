Sendak, or Infrastructure-as-a-service-as-a-servic
===

Sendak's primary purpose in life is to manage the cloud provisioning process
for medium-to-large organisations. With Sendak, users become associated with
groups in IAM as well as with software projects on GitHub (or other git
repositories); by their association with software projects it is possible to
see which ec2 machines a user is nominally (although there is no hard link)
associated with

These projects are typically associated with a Virtual Private Cloud (VPC),
allowing users within that project to have super-user-ish powers over assets
that are specific to their project, while not requiring greater access to the
assets under the larger realm of the AWS account under management

Additionally, Sendak allows us to better manage onboarding of users and
verification of, for example, their use of multifactor authentication (MFA)

Lastly, Sendak allows operators to, from the command-line, bring up new EC2
instances with software via git and automatically deploy these in a way that
is consistent, repeatable, and assumedly as safely as when the project was
tagged and committed. This last process is "pluggable," and could be as
simple as patching `/etc/hosts` to include the names/addresses of its
neighbors, or as complex as joining a database cluster, running an automated
build/test procedure, or basically anything else that can be executed over
`ssh`. The documentation for this "pluggability" is in the `bin/` directory

[@avriette](https://github.com/avriette), jane.avriette@gsa.go

What is all this stuff
===

* `bin` - separated out by language; these are called by the sendak
dispatcher, so something that is called `bin/js/build-node.js` would be
invoked by `sendak build-node --long-arg param` and similar. All these tasks
take `--long-arguments` to include `--help` (and are quite helpful,
so&hellip;).

* `components` - this directory is broken out by functionality and language;
the Riak interface for Sendak's javascript components live in
`components/common/js`; the Sendak deploy libraries that use
Fabric live in `components/python/fabfile.py`, et cetera. These should
(generally) not be executables but rather libraries/shared code. 

* `doc` - contains usage documentation and design documentatio

* `etc` - config files, keys, and similar. Most (all?) of this is not checked
in to git

* `contrib` - these things are helpful but not really "officially part of the
sendak distribution." If you have something that would be useful to Sendak
users, this is the place to add it and submit a PR

What's a Sendak
===

From Wikipedia

**Maurice Bernard Sendak** (/ˈsɛndæk/; June 10, 1928 – May 8, 2012) was
an American illustrator and writer of children's books. He became widely
known for his book *Where the Wild Things Are*, first published in 1963. Born
to Jewish-Polish parents, his childhood was affected by the death of many of
his family members during the Holocaust. Besides *Where the Wild Things Are*,
Sendak also wrote works such as *In the Night Kitchen* and *Outside Over
There*, and illustrated *Little Bear*

The progenitor of this software was called Thing Launcher, which was developed
at [CFPB](http://www.consumerfinance.gov/).

Sendak, you see, keeps track of the Wild Things for devops.
