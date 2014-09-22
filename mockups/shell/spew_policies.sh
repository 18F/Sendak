#!/bin/bash
GROUPS=`aws iam list-groups | grep GroupName | awk '{ print $2 }' | tr -d '"'`
echo $GROUPS >> /dev/stderr
for group in "$GROUPS"; do
	POLICIES=`aws iam list-group-policies --group-name $group | grep -E '^        ' | tr -d '"'`
	for policy in $POLICIES; do
		echo aws iam get-group-policy --group-name $group --policy-name $policy
	done
done

# fgsfds doing this in fucking node
