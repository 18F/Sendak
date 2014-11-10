Installing a suitable environment for Sendak
====

* Riak.

You will need a connection to Riak. 18f has an instance of Riak that is
accessible within the GSA /16.

Once you have an account on that machine, you should be able to port forward
to the Riak instance there. This might look like this in your `~/.ssh/config`:

```
Host infdb
  HostName infdb.18f.us
  ControlMaster auto
  ControlPath /tmp/ssh-%r@%h:%p
  LocalForward 8098 127.0.0.1:8098
  User jane
```

* Shell

  - It is advisable to have the `aws-cli` package from Amazon installed. You can
  install this through the Python package manager with `pip install awscli`.
  - You will need the secret key and the api key from your Amazon account.
  This is available from the Amazon IAM page. You will need to put this in
  `~/.aws/config`, as sendak reads its stuff from there (a secret key and access
  key is available, but difficult to find, in the AWS console).
  - Your environment will contain various shell variables for the sake of
  configuration; these are defined in `contrib/bash_env.sh`. Each variable is
  defined with a comment in that file.
  - Once you have the credentials and environment configured, and your
  javascript and python packages installed, you should be able to begin using
  Sendak by issuing `sendak --help` and similar. There is a `sendak --list-tasks`
  command that will show you the available tasks. At present this does not
  report on their suitability at all and merely indicates their presence in
  the `bin/` tree.
