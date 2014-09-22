#### Sendak, or Infrastructure-as-a-service-as-a-service

Sendak enables someone to launch Things from cloudly locations such as ec2. For now the
documentation does not actually include the exact format of what a Thing looks like, but
consider it to be a directory on github with a fab file.

@avriette, jane.avriette@gsa.gov

##### Stuff that lives here:

* `bin` - separated out by language; these are called by the sendak dispatcher, so something that is called bin/js/build-node.js might be invoked by `sendak build-node --long-arg param` and similar.

* `components` - this directory is broken out by functionality; ORM stuff lives in `components/orm`, libraries that work with Fabric live in `components/fabfile`, et
 cetera. These should (generally) not be executables but rather libraries/shared code. An executable only belongs in the `components/` directory if it is responsible for maintaining that component (such as a database initialisation script for the ORM/database).

* `doc` - contains various and sundry documentation and artifacts related to development of Sendak. To be substantially cleaned-up and presentable-made.

* `etc` - config files, keys, and similar. 

* `mockups` - “straw men”/“wireframes” and similar pieces of code designed to demonstrate a functionality or what something would look like If It Really Worked™. None of these should ever be considered functional, safe, or production-ready. If you find yourself using something here more than once, please clean it up and place it in `bin/`.

* `contrib` - these things are helpful but not really "officially part of the sendak distribution." If you have something that would be useful to Sendak users, this is the place to add it and submit a PR.
