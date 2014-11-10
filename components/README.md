* `common` - this is helper code that various backend components will need to use (so you can `require (‘./components/common/precious_stuff.js’)` and re-use code between your pieces
* `fabfile` - so far this doesn’t have anything in it but it is the pieces that interact with Fabric.
* `github` - this is where the backend parts that interact with (a) Github go. For now this is javascript that writes shell, eventually should be native API calls to github.
