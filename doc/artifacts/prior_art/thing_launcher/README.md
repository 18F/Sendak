# It launches things!

A a proof-of-concept web app for launching development ec2 instances.

Right now, the app:

- authenticates you with your github account
- adds (your choice of) github SSH keys to the instances authorized_hosts, letting you use your existing private key to connect
- configures the instance with apache2 and other goodies
- (optionally) clones a github repo to ~/code
- if that repo includes a <a href="http://docs.fabfile.org/en/1.3.3/index.html">fabfile</a> at the top level, it'll be run (allowing for further customization of the environment)
- The <a href="https://github.com/sebastien/cuisine">Cuisine</a> API is available for use in your fabfile. See <a href="http://www.slideshare.net/ffunction/fabric-cuisine-and-watchdog-for-server-administration-in-python">this presentation</a>, starting on page 41. 


##### note from @avriette

this was originally written inside cfpb and we're cannibalising some of the code for use
in sendak (well, treating it as wireframes); thinglauncher is officially not a living 18F
project.
