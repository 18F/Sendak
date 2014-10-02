### Sendak, or Infrastructure-as-a-service-as-a-service

Sendak enables someone to launch Things from cloudly locations such as ec2. For now the
documentation does not actually include the exact format of what a Thing looks like, but
consider it to be a directory on github with a fab file.

@avriette, jane.avriette@gsa.gov

#### Stuff that lives here:

* `bin` - separated out by language; these are called by the sendak dispatcher, so something that is called bin/js/build-node.js might be invoked by `sendak build-node --long-arg param` and similar.

* `components` - this directory is broken out by functionality; ORM stuff lives in `components/orm`, libraries that work with Fabric live in `components/fabfile`, et
 cetera. These should (generally) not be executables but rather libraries/shared code. An executable only belongs in the `components/` directory if it is responsible for maintaining that component (such as a database initialisation script for the ORM/database).

* `doc` - contains various and sundry documentation and artifacts related to development of Sendak. To be substantially cleaned-up and presentable-made.

* `etc` - config files, keys, and similar. 

* `mockups` - “straw men”/“wireframes” and similar pieces of code designed to demonstrate a functionality or what something would look like If It Really Worked™. None of these should ever be considered functional, safe, or production-ready. If you find yourself using something here more than once, please clean it up and place it in `bin/`.

* `contrib` - these things are helpful but not really "officially part of the sendak distribution." If you have something that would be useful to Sendak users, this is the place to add it and submit a PR.

* `var` - as per convention your runtime files go here (such as `datastore.json` from the odorm module)

#### Things you will need

For Javascript:

* nopt
* nopt-usage
* findit
* aws-sdk

Just `npm install packagename`.

For Python:

* Fabric

And you will find libraries for use in both languages under `components/common/`.

#### Installation

1. For the moment, simply pulling Sendak down from github with `git clone git@github.com:18F/Sendak.git sendak` will give you everything you need but the prerequisites and amazon aws credentials.
2. It is advisable to have the `aws-cli` package from amazon installed. On a Mac, this is `brew install awscli`. I am sure there is an equivalent to Ubuntu and so forth.
3. You will need the secret key and the api key from your amazon account. This is available from the amazon IAM page. You will need to put this in `~/.aws/config`, as sendak reads its stuff from there.
4. Your environment will contain various shell variables for configuration's sake; these are defined in `contrib/bash_env.sh`. You are welcome to use the `/Users/jane` directory, but it is recommended you change this to something more appropriate. Each variable is defined with a comment in that file.
5. Once you have the credentials and environment configured, and your javascript and python packages installed, you should be able to begin using sendak by issuing `bin/sendak.sh --help` and similar. There is a `bin/sendak.sh --list-tasks` command that will show you the available tasks. At present this does not report on their suitability at all and merely indicates their presence in the `bin/` tree.
6. If you do not have a sendak environment already, you may want to issue `mockups/js/odorm_init.js` which will create a suitable `datastore.js` file. For the moment this is not documented. Its location is configured via the `$SENDAK_DATASTORE` variable but otherwise sendak expects something to be available in `var/datastore.json`.

#### What's a Sendak?

From Wikipedia:

**Maurice Bernard Sendak** (/ˈsɛndæk/; June 10, 1928 – May 8, 2012) was an American illustrator and writer of children's books. He became widely known for his book *Where the Wild Things Are*, first published in 1963. Born to Jewish-Polish parents, his childhood was affected by the death of many of his family members during the Holocaust. Besides *Where the Wild Things Are*, Sendak also wrote works such as *In the Night Kitchen* and *Outside Over There*, and illustrated *Little Bear*.

The progenitor of this software was called Thing Launcher (see `doc/artifacts/prior_art`), which was developed at CFPB.