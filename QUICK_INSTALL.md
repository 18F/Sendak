Sendak Installation
====

Run `npm install sendak`. This will install Sendak into your current working
directory.

The configuration of [`rrm`](https://github.com/avriette/rrm) and
[`riak-dc`](https://github.com/avriette/riak-dc) are beyond the scope of
this document. Please see documentation there for installation & configuration
instructions. It is assumed you have a connection to a working Riak; the
default is localhost on port 8098.

Configure your environment:

* Amazon AWS config:
  - `export AWS_ACCESS_KEY_ID=$(grep s_access_key ~/.aws/config | cut -d' ' -f 3)`
  - `export AWS_SECRET_ACCESS_KEY=$(grep aws_sec ~/.aws/config | cut -d' ' -f 3)`
  - `export AWS_REGION=$(grep region ~/.aws/config | cut -d' ' -f 3)`

* Sendak environment:
  - `export SENDAK_DRY_RUN=true # to test the environment`
  - `alias sendak="$(pwd)/node_modules/sendak/bin/sendak.js"`
