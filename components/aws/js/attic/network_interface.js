// abstracting away amazon's network interface flag for e.g., runinstances
//
var network_interface =
	{
		// One assumes this is self-describing but it is undocumented.
		//
		AssociatePublicIpAddress : true, // | false

		// It is unclear how this pertains to network interfaces at all, and is undocumented.
		//
		DeleteOnTermination : true,      // | false

		// This seems to be a 255-byte string and probably corresponds to the editable field
		// on the left-most column in the console.
		//
		Description : 'string value',    // free-form?
		
		// "The index of the device for the network interface attachment."
		// No, it's not real clear what it is.
		//
		DeviceIndex : 0,                 // not sure

		// From the docs, it kind of looks like this refers to security groups. However,
		// runinstances actually allows you to specify securitygroups, so, uh..
		//
		Groups : [
			'string value'                 // what?
			// , ... more strings
		],

		// "The ID of a network interface." - this isn't any clearer than that in the docs.
		//
		NetworkInterfaceId       : 'string value', // required but unclear
		
		// You ask for the private address you'd like and if you can have that (it's on one of
		// your subnets) it gives it to you. It seems to say that it fails if you don't.
		//
		PrivateIpAddress         : 'string value', // one assumes CIDR?

		// Allocate multiple addresses. Only one may be set to true. All must live subnets in
		// your purview.
		//
		PrivateIpAddresses       :
			[
				{
					PrivateIpAddress   : 'string value', // CIDR?, requried
					Primary            : true            // | false
				}
			],
		
		// Specify attributes about where to put the new instance.
		//
		Placement                :
			{
				AvailabilityZone : 'string value',       // us-east-1a i guess?

				Tenancy          : 'default',            // | dedicated

				// This is actually the groupname from e.g., 'createPlacementGroup', and must be
				// unique within the scope of your account.
				//
				GroupName        : 'string value'        // ??
			},
	};
