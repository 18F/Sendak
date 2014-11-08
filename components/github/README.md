Your Sendak environment
====

* `SENDAK_HOME`

Where Sendak lives. This might be `/usr/local/sendak` or `/tmp`, but should be
fully-qualified.

* `SENDAK_DRY_RUN`

If this is variable is set, Sendak will just show you would it would be doing.
Note some operations cannot be dry-run.

* `SENDAK_IDENTITY`

Sendak uses ssh keys for git deploys. This variable should be an ssh private
key like `${HOME}/.ssh/keyname_dsa`, and needs to be something Github trusts
for the user you are using with Sendak.

* `SENDAK_USER`

The name of the github user that Sendak is to log in to repositories with.
