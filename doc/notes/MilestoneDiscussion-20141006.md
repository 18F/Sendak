# Sendak Milestone Discussion

Date: 10/06/2014

### Milestone 1

Our most common task right now is that we create new users.

* Create new user
    * Requirements to test --
        * New hire
        * On existing project
    * Create AWS user
        * Task: Create a Markdown document that describes how to turn on MFA
        * Without MFA
        * User will only have ability to set up MFA
        * User will set up MFA
    * Sendak will give more rights when MFA is enable
        * Involves a check if that users setup is correct
        * Will tell us when the last password has been changed.

### Milestone 2

*Creating a new project -- Group/VPC
    * Can mean a lot of things -- right now, a VPC is created -- that is new project
    * Requires that the users that are a part of this project.
* User B has full access to VPC B, but User B needs access to VPC A.
    * Not only create new projects, but manage users in projects
    * Noah: "Second, most common use case" (after Milestone 1)

### Other things that were mentioned

* “Problems” with users in AWS
    * Users with bad names
* Reverse data in AWS
    * We need to take the data out of the AWS so we can access to do things.

* Naming conventions
    * We don’t have naming conventions for VPCs or resources
    * Canonical code that represents the project name
    * ‘client-’ needs to be a part of the naming convention for billing purpose.

* How to install
    * Clone, have AWS, & github user

* Where does the file live that knows who is a Sendak user
* Right now, we are talking about three different user types:
    * Datastore user type
    * User to auth to github
    * Amazon user

* What is Sendak’s role in CI?
    * Sendak -- build node
    * How do we accommodate?
    * ToDo: We need to have a discussion about which CI platform
        * So, we don’t have 10 platforms that do CI & have access to AWS - security nightmare.
