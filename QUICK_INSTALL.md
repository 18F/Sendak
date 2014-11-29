Sendak Installation
===

1. git clone this repo somewhere.
* issue `npm install` to get your node dependencies
* create an alias for `sendak=bin/sendak.js`
* you may want to check your environment with `sendak check-environment --{riak,rrm,github,aws}`

The configuration of [`rrm`](https://github.com/avriette/rrm) and
[`riak-dc`](https://github.com/avriette/riak-dc) are beyond the scope of
this document. Please see documentation there for installation & configuration
instructions. It is assumed you have a connection to a working Riak; the
default is localhost on port 8098.

Configure your environment:
===

* Amazon AWS config:
  - `export AWS_ACCESS_KEY_ID=$(grep s_access_key ~/.aws/config | cut -d' ' -f 3)`
  - `export AWS_SECRET_ACCESS_KEY=$(grep aws_sec ~/.aws/config | cut -d' ' -f 3)`
  - `export AWS_REGION=$(grep region ~/.aws/config | cut -d' ' -f 3)`

* Sendak environment:
  - `export SENDAK_DRY_RUN=true # to test the environment`
  - `alias sendak="$(pwd)/node_modules/sendak/bin/sendak.js"`

* Github configuration:
	- `GH_TOKEN` or `GH_SECRET` && `GH_KEY` need to be set according to the [github oauth docs](https://developer.github.com/v3/oauth/)

Gotchas
===

You may notice some tasks are not responsive the way you might expect:
```
fetch:sendak jane$ sendak list-iam-groups
[ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ]

child process exited ð
```
Generally, Sendak expects you to proactively declare what you want from it, and
does not assume you want anything by default. So to properly invoke `list-iam-groups`,
you would instead say:

```
fetch:sendak jane$ sendak list-iam-groups --arn --gid --groupname
[ { arn: 'arn:aws:iam::144555555553:group/default-group',
    gid: 'AGPAXXXXXXXXXXXXXXLXG' },

# ...
    gid: 'AGXXXXXXXXXXXXXXXX2EY' } ]

child process exited ð
```
And of course, all tasks will respond to `--help`.
