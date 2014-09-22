// 18f customer object description
{
	customername: "this is a string",
	customerid:   "this is some sort of nonce we'd use like a pkey",
	customerdesc: "a string saying who/what this customer is/are",
	customerpoc:  "a string containing who the point of contact is",
	users: [
		// a series of (18f) user objects
	],
	customerroot: "who is the superuser for this group? [an 18f user object]",
	awsgroupid:   "a string", // this is an aws iam arn
	// note: from the aws iam arn, we can pull the policy out of iam
}

// 18f user object description
{
	username:     "this is a string name, so Jane A Doe", // pull this from aws?
	iam_id:       "this would be the arn for this user",  // pulled from aws iam
	group_id:      "a reference to a customer.customerid unique identifier",
	// note: from the aws iam arn, we can pull the policy out of iam
}

// 18f node object description
{
	group_id:      "a reference to a customer.customerid unique identifier",
	aws_attribs:   "a pointer to the aws object for purposes of attrib accessors", // object
	gh_project:    "a pointer to the github project object", // object
	// note the aws ec2 arn &c can be pulled from aws, the gh attribs from gh
}

// 18f gh project object description
{
	group_id:      "a reference to a customer.customerid unique identifier",
	gh_object:     "a reference to the github object",
}
