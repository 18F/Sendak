# Sendak, or Infrastructure-as-a-service-as-a-service

Sendak is a [Node.js application](http://nodejs.org/) gives the [18F](https://18f.gsa.gov) DevOps team a single interface
to manage its projects, users, and deployments across Amazon Web Services and
GitHub.

Sendak lets teams specify **projects**, which can be linked to:

* AWS IAM users
* AWS resources in VPCs
* Git/GitHub repositories

Sendak also enables **team permission management**. For example:

* Granting individual permissions (e.g. importing SSH keys)
* Checking for whether multi-factor authentication is enabled

Finally, Sendak provides a **consistent deployment interface** that wraps a
project's existing deployment and configuration process.

To get started:

* [Usage](#usage)
* [Setting up Sendak](#setting-up-sendak)
* [What's a Sendak?](#whats-a-sendak)

If you're _developing_ Sendak, check out the [developing guide](DEVELOPING.md).

Primary author: [@janearc](https://github.com/janearc), jane.arc@gsa.gov

## Usage

Commands take the form:

```bash
sendak [command] [--options]
```

For example, to list certain fields about your IAM groups:

```bash
sendak list-iam-groups --arn --gid
```

This returns something like:

```
[ { arn: 'arn:aws:iam::1234567890:group/default-group',
    gid: 'XXXXXXXXXXXXXXXXXXXXXX' } ]
```

Ask for help and available options for any command with `--help`:

```bash
sendak list-iam-groups --help
```

For a full list of commands:

```bash
sendak --list-tasks
```

## Setting up Sendak

[Node](http://nodejs.org/) is required to run Sendak.

* Open a terminal and check out the project. (Node uses `npm` for package management - a `npm` based installation is forthcoming.)

```bash
git clone https://github.com/18F/Sendak.git sendak
cd sendak
```

* Install dependencies:

```bash
npm install
```

* Until Sendak is in `npm`, you may wish to add an alias to your `.bashrc` or
`bash_profile` that points to `bin/sendak.js`:

```
alias sendak=/path/to/bin/sendak.js
```

* Configure your AWS credentials. Sendak first looks for config files in your
`~/.aws` directory, as created by the [AWS Node
SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
or the [AWS CLI tool](https://aws.amazon.com/cli/).

* If you don't have `~/.aws` config files, Sendak looks for environment
variables:

```
export AWS_ACCESS_KEY_ID=[your-access-key]
export AWS_SECRET_ACCESS_KEY=[your-secret-key]
export AWS_REGION=us-east-1
```

* If you'll be using GitHub private repositories, you'll need to provide
GitHub credentials. The simplest way to authenticate is to create a **personal
access token** in your [GitHub application settings](https://github.com/settings/applications) and set it to an environment variable:

```
export GH_TOKEN=[your-app-token]
```

(You can also use
[full application OAuth](https://developer.github.com/v3/oauth/) credentials
by setting `GH_KEY` and `GH_SECRET`.)

* If you plan to work with your team's project metadata, you'll need access to
your team's [Riak](https://github.com/basho/riak) instance. Sendak will expect Riak at
`localhost:8098` by default.

* Check that your environment is working:

```bash
sendak check-environment --riak --github --aws
```

You should now be able to run [Sendak commands](#usage).

## What's a Sendak

From [Wikipedia](https://en.wikipedia.org/wiki/Maurice_Sendak):

**Maurice Bernard Sendak** (/ˈsɛndæk/; June 10, 1928 – May 8, 2012) was
an American illustrator and writer of children's books. He became widely
known for his book *Where the Wild Things Are*, first published in 1963. Born
to Jewish-Polish parents, his childhood was affected by the death of many of
his family members during the Holocaust. Besides *Where the Wild Things Are*,
Sendak also wrote works such as *In the Night Kitchen* and *Outside Over
There*, and illustrated *Little Bear*.

The progenitor of this software was called Thing Launcher, which was developed
at [CFPB](http://www.consumerfinance.gov/).

Sendak, you see, keeps track of the Wild Things for devops.


## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in
[CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright
> and related rights in the work worldwide are waived through the
> [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication.
> By submitting a pull request, you are agreeing to comply with this waiver of
> copyright interest.
