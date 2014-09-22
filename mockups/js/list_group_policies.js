// probably :colo koehler, jane

// so this doesn't actually do anything. it was written to just dip toes into the iam api in node.
// as it happens the api is kind of icky and doesn't do the right thing. or rather, only does the right thing some of the time.
// which is to say it does the wrong thing some of the time. and that is why i have trust issues.
// 20 aug 2014
//

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

var iam = new AWS.IAM();

// just give me all the things pls
var ls_group_params = { };

iam.listGroups( ls_group_params, function( err, groups ) {
	if (err) console.log(err, err.stack); // oops
	else {
		for (groupindex in groups.Groups) {
			// at this point we ask it to 
			//     aws iam list-group-policies --group-name
			// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroupPolicies-property
			//
			// without additional limits (marker, maxitems), this is just going to ask for 
			// all the things.
			//
			var ls_group_policy_params = {
				GroupName: groups.Groups[groupindex].GroupName
			};

			// console.log( "checking group policies for " + params.GroupName );
			iam.listGroupPolicies(ls_group_policy_params, function( err, policies ) {
				if (err) console.log(err, err.stack); // oops
				else {
					for (policynameindex in policies.PolicyNames) {
						// and then we need to ask it to
						//     aws iam get-group-policy --policy-name beeboop --group-name blarp
						// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getGroupPolicy-property
						//
						// so elsewhere the data returned is a dictionary or an array. but what they give
						// us from listGroupPolicies is an object, which has methods: PolicyNames IsTruncated Marker
						// because amazon loves us so.
						//
						var enumerate_policy_params = { // nomenclature here is tricky with the API re-using list_group_noun
							GroupName: groups.Groups[groupindex].GroupName,
							PolicyName: policies.PolicyNames[policynameindex]
						};
						iam.getGroupPolicy( enumerate_policy_params, function( err, policydata ) {
							if (policydata) {
								var the_policy ;
								// So the return here is a uri-encoded string. If we unescape() this, we get [object Object]. Okay, then.
								the_policy  = decodeURIComponent( policydata.PolicyDocument );
								this_group  = policydata.GroupName;
								this_policy = policydata.PolicyName;

								console.log( "- - -" );
								console.log( "request id: " + policydata.ResponseMetadata.RequestId );
								console.log( "group name: " + this_group );
								console.log( "policy name: " + this_policy );
								console.log( "policy follows:" );
								console.log( the_policy );
								console.log( "- - -" );
							}
							else {
								// boo hoo
								// XXX: Why does this happen?
								//
								// console.log( "null policy document returned. next." )
							} // else policydoc isn't true
						} ); // getGroupPolicy (group name, policy name)
					} // policy index iterator (for)
				} // else
			} ); // list group policies
		} // group index iterator (for)
	} // else
} ); // list groups callback
