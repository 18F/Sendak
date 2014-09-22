##infrastructure as a service as a service (iaasaas)
Yes, really that.

Basic functionality is thus:

A user comes to me who wants to run a new application “in the cloud.” Language problems aside, the basic functionality we need to provide is:

* Create new IAM users for this user, assuming they get one or more “sub root” users that can manage All The Things within their purview.
* Spin up one or more nodes for them inside EC2.
* These nodes should have software they have already put on Github, so this tool needs to interact with Github and amazon.
* The description of what this node does and which ports are open and so forth should be in user-understandable documents like json which live in the provided github repository. (this is starting to look like a [fab file](http://docs.fabfile.org/en/1.9/])
* For 18f’s part, we need to be able to say “what are the names of all the projects in 18f-land?” and “who has access to machine app-west-1 right now?” and “who is the superuser for that project?” [generally we call this metadata]
* @noah would also like for vagrant and vmware and other images to be created by the same software so that when we onboard a new project/agency, they can get to the business of testing or whichever. Ideally this would be carved out the same way we are creating AMIs for the user when we spin up a new EC2 node for them.

So accordingly our requirements are:

* Access to AWS IAM
* (porgrammatic) Access to Github, to include a repository which itself has something like a “config.json” file
* A datastore that is durable and lives somewhere that is low-maintenance/low-resource-consumption.
* Breakdown of tasks to small granularity; whatever we use to create an AMI should be stupid enough to also create an image for vmware, vagrant, or whichever.
* A better name than iaasaas. For real, who can even say that?

An example run of the tool might be:

* `awscarve -new -cname carvelet.18f.gsa.gov -github -projectname 18f/some_nouns_here`
* `awscarve -vagrant -github -projectname 18f/some_nouns_here`

