* github_shell - calls out to shell from node to pull a github repo by name with branch

your environment should look like:

````
fetch:node-sendak jane$ env | grep -i sendak
SENDAK_HOME=/tmp
SENDAK_DRY_RUN=true
PWD=/Users/jane/dev/DevOps/sendak/node/node-sendak
SENDAK_IDENTITY=/Users/jane/.ssh/sendak_dsa
SENDAK_SSH=~/.ssh/sendak_dsa
SENDAK_USER=18f-sendak
fetch:node-sendak jane$ 
````

* github_node - (TODO) uses native api calls to fetch a repo
