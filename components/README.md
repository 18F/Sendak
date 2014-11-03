* `aws` - in here live the components that interact with Amazon web services, including IAM and EC2.
* `common` - this is helper code that various backend components will need to use (so you can `require (‘./components/common/precious_stuff.js’)` and re-use code between your pieces
* `fabfile` - so far this doesn’t have anything in it but it is the pieces that interact with Fabric.
* `github` - this is where the backend parts that interact with (a) Github go. For now this is javascript that writes shell, eventually should be native API calls to github.

#### Planning for the future

Note that all these things are separated so that in the future if I need to (for example) replace my sql model with a json-on-disk thing, I can do that. The code is supposed to be largely [orthogonal](http://www.javaworld.com/article/2078767/open-source-tools/java-tip-orthogonality-by-example.html) (apologies for Java reference) so that the back-ends can change while the interfaces remain the same and code-churn is reduced. Additionally the highly-segregated nature of the software makes inter-language operation (as so far we have shell, javascript, and python; I am almost certain later I will get lazy and there will be perl pieces) development not just possible, but pretty easy.

Patches welcome, et cetera.


