#### Sendak is the 18f "Thing Launcher." Named thusly for reasons.

*(this is adapted from [whiteboard](https://github.com/18F/DevOps/blob/ba63f4caf9644b4c05666e6683bf4aad29ac4ba3/sendak/artifacts/original_concept_sketch_jane.png) [sketches](https://github.com/18F/DevOps/blob/ba63f4caf9644b4c05666e6683bf4aad29ac4ba3/sendak/artifacts/sendak_parts.png) & [scratchings at treethings](https://github.com/18F/DevOps/blob/f132128e2b3e6e4ec78a200bc0c18e36b529904a/sendak/artifacts/sendak_flow_10_sep.jpg))*

Four major components:

1. Github integration
2. AWS integration
3. Postgres datastore
4. Filesystem "workers"


##### Github
Github integration needs the following pieces:

* A thingie to pull repos from github [ [done](https://github.com/18F/DevOps/blob/37969444775f9da6e2b8266f1680acec1cb4d30d/sendak/node/node-sendak/components/github/github_shell.js) ]
* Interaction with [fab files](http://docs.fabfile.org/en/1.9/usage/fabfiles.html)

> so this is going to be tricky. basically we have to write python code that pulls in information we grabbed from sendak
> when bringing up nodes. so we extend fabric (which is easy enough) and then use the rest of fabric to do the right
> thing on the remote node (because that is what it lives to do).

* A widget to execute shell code on new nodes. This basically should follow the idiom [used here](https://github.com/avriette/misc/blob/master/joshsz/challenge.sh#L98)

> this will be fabric, most likely. something like `fab -H nodename footask`

##### AWS
AWS has these parts:

* Pulling in AWS IAM metadata
* Creates groups, users, policies, security groups, vpcs (and manages vpcs)
* Creates new nodes inside ec2 with sgs [ [done](https://github.com/18F/DevOps/blob/f548de6322185643fc209db485271dbabff81cd6/sendak/node/node-sendak/components/aws/run_instance.js) ]

##### Postgres
Sendak needs a database to keep state and metadata during operations.

* This requires the sequelisejs ORM & an associated schema, initdb script, and so forth. [ [kind of done - the beginning of an ORM is there](https://github.com/18F/DevOps/blob/37969444775f9da6e2b8266f1680acec1cb4d30d/sendak/node/node-sendak/app.js) ]

##### Filesystem workers
It is unclear how this actually will look. But if we containerise sufficiently, it should not actually matter much. This however requires that we sandbox e.g., ec2 node creation so that we can rip out the backend and put in something more API-y and not-technical-debt-y once we are done misbehaving by running shell from js/python/etc.

* Vagrant
* Vmware
* Vbox
