# Developing Sendak

Help for people working on Sendak. You should be familiar with the
[usage](README.md#usage) and [setup process](README#setting-up-sendak)

What is all this stuff
---

* `bin` - separated out by language; these are called by the sendak
dispatcher, so something that is called `bin/js/build-node.js` would be
invoked by `sendak build-node --long-arg param` and similar. All these tasks
take `--long-arguments` to include `--help` (and are quite helpful,
so&hellip;).

* `doc` - contains usage documentation and design documentation.

* `contrib` - these things are helpful but not really "officially part of the
sendak distribution." If you have something that would be useful to Sendak
users, this is the place to add it and submit a PR.

Debugging this is really hard!
---

Yeah, it is. However, if you set `process.env.DEBUG` to something truthy,
`log4js` will inundate you with loggish data, indicating when you&apos;re
inside and out of promises, when transactions in riak get opened, and so on.
If you&apos;re still not sure what&apos;s going on, setting `process.env.DEBUG`
to `TRACE`, all your output to stdout will go via `console.trace` and
`util.inspect`. *NOTE:* this will fill up disks very, very quickly.
