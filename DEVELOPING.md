# Developing Sendak

Help for people working on Sendak. You should be familiar with the
[usage](README.md#usage) and [setup process](README.md#setting-up-sendak)

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

The API
---

Generally, all functions exported by the Sendak back-end have jsdoc explanations
for what's required of the caller to get Things from Places.

##### Sendak.users.iam

Sendak provides simplified, unified, consistent calls to AWS IAM; these calls
are authoritative/destructive/whichever, so be aware there is a) usually a
cost associated with API calls and b) things can break in wild ways when
removing users or policies in AWS.

* `Sendak.users.iam.get(object)`
```javascript
Sendak.users.iam.get( {
	// Use a regular expression (or string)
	'pattern': '[Jj]ane',

	// Or explicitly look for a username; this is case-sensitive
	'user-name': 'JaneArc',

	// If you want all the usernames
	'user-name': true,

	// Or explicitly look for an arn
	'arn': 'arn:aws:iam::555555555555:user/JaneArc',

	// If you want all the arn's
	'arn': true,

	// Or explicitly look for a uid
	'user-id': 'AIDAXXXXXXXXXXXXXXXOS',

	// If you want all the uid's
	'user-id': true,

	// Since Sendak also stores this data in Riak, you may request a cached
	// copy from Riak and save yourself the call to AWS IAM (which is time-
	// consuming); of course, IAM is the authoritative source.
	'cached': true,
} ).then( function (users) {
	// Your users are here.
} );
```

* `Sendak.users.iam.create(object)`
```javascript
Sendak.users.iam.create( {
	'user-name': 'JaneArc'
} ).then( function (arn) {
	// The return value here is the ARN that Amazon provided, or a (hopefully)
	// meaningful Error object 'splaining what went wrong.
} );
```

* `Sendak.users.iam.mfa.create(object)`
```javascript
Sendak.users.iam.mfa.create( {
	'user-name': 'JaneArc'
} ).then( function (mfadata) {
	// mfadata.contents - a PNG of a QR code you should write somewhere safe
	// mfadata.sn - the 'serial number' of the mfa device
} );
```

##### Sendak.users.github

Note that creating or modifying users in Github is outside the scope of what
Sendak actually does; we associate a github user with an IAM user with a "person"
in the backend for managing e.g., permissions or verifying MFA status, etc.

* `Sendak.users.github.get(object)`
```javascript
Sendak.users.github.get( {
	// Use a regular expression (or string)
	'pattern': '[Jj]ane',
	
	// Or explicitly look for a username; this is case-sensitive
	'user-name': 'janearc',

	// If you want all the usernames
	'user-name': true,

	// You *must* specify an organisation
	'org': '18F',

	// Since Sendak also stores this data in Riak, you may request a cached
	// copy from Riak and save yourself the call to github (which is time-
	// consuming); of course, github is the authoritative source.
	'cached': true,
} ).then( function (users) {
	// Your users are here.
} );
```

##### Sendak.users.sendak

Sendak itself uses Riak and rm to store metadata and state mapping for aws,
github, and "the organisation." These users and their metadata is expressly
*not* the same as AWS or github, and is non-binding; it is *metadata*. To
access that metadata, the `Sendak.users.sendak.*` methods exist.

* `Sendak.users.sendak.get(object)`
```javascript
Sendak.users.sendak.get( {
	// Use a regular expression (or string)
	'pattern': '[Jj]ane',

	// Or explicitly look for a username; this is case-sensitive
	'user-name': 'JaneArc',

	// If you want all the usernames
	'user-name': true,

	// Or explicitly look for an arn
	'arn': 'arn:aws:iam::555555555555:user/JaneArc',

	// If you want all the arn's
	'arn': true,

	// Or explicitly look for a uid
	'user-id': 'AIDAXXXXXXXXXXXXXXXOS',

	// If you want all the uid's
	'user-id': true,

	// The given name of the user
	'given': 'Jane',

	// If you want all given names
	'given': true,

	// The surname of the user
	'surname': 'Arc',

	// If you want all the surnames
	'surname': true

	// Data in Sendak is by definition cached. The default operation is to,
	// with every call, check against IAM and github to verify its internal
	// integrity. Providing a truthy 'cached' parameter will simply return
	// whatever Sendak has in the backend without checking AWS or github.
	'cached': true,
} ).then( function (users) {
	// Your users are here.
} );
