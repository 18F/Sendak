# User process

This is rough walk through of functionality that has been discussed and how it might work.

* User installs Sendak? (Not discussed, but we should.)

* Users would type something like this on their local machine:
 ```
 sendak carve --project-name argus --users=alice,mary,sue --machine_count 3 --repo_url
 ```

* Python/fabric would parse the arguments as they were passed, then call carve.

#### Carve

* Carve would be a function (or series of functions) in Python in Sendak which would do the following...
  * Create EC2 instandes (nodes) by calling the shell command that is already written.
  * Collect the return information from the nodes to know where the node are located & dump the info in json to file.
    * inventory.json
  * Get or create an IAM group (not created yet, Python or Node)
  * Get or create Users which belong to the IAM group (not created yet, Python or Node)
    * If you create a user it will have an arn. You can use this to search for users and create groups.
  * Save groups and users to inventory.json?
  * Push inventory.json to /etc/sendak/ on the nodes, so the nodes have knowledge of each other.
  * Pull down github repo for the project that should be deployed.
  * Execute fabric script in project directory
    * This should execute the set up of the project itself, like...
        * Create groups on the machine
        * Create users on the machine
        * Setup project datastore
        * Setup project code
        * etc....
    * From project fabric script, folks can do the following.
      ```
      from sendak import who_are_my_machines
      ```
