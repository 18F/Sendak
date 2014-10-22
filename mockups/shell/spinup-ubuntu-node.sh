#!/bin/sh

DEBUG=1

NOTES=<<NOTES
So this script uses the aws-cli package from Amazon. You can install that
using pip install aws-cli. You'll have to add credentials to the file
~/.aws/config, like so:

haram:joshsz jane$ cat ~/.aws/config
[default]
aws_access_key_id=WORDSWORDSWORDS
aws_secret_access_key=wordsWordswordsWORDS
# Optional, to define default region for this profile.
region = us-east-1

Please see comments a few lines down re variables that will be useful for
you.

Honestly if this got any bigger I'd switch to perl so I could have
getopt-long or break everything into smaller shell functions (but that seems
kind of silly). Ultimately, though, this works out to seven lines without the
comments, vertical spacing, and variable declarations, so it seems to me like
shell was an okay solution.

The one thing it's not doing is checking to see if the security group or ssh
keys are actually created. On balance, this doesn't seem harmful, and going
to actually check to see if they were there creates substantially more code
for dubious benefit.
NOTES

export AWS_DEFAULT_REGION=us-east-1
export AWS_AVAILABILITY_ZONE=us-east-1d
export AMAZON_DERP_DELAY=15
export UBUNTU_DERP_DELAY=60
export MY_NAME=`whoami` # not portable to everywhere

# You'd change these to reflect the subnet and mask you would use for you.
export MY_HOME=173.8.15.238
export MY_MASK=32

# You would change this to the location of your key (I only have the public
# key, and have used my key so I can verify my work)
SSH_KEY=~/.ssh/id_rsa

# Debugging utility
log () {
	# If this annoys, just swap this to logger(1)
	[[ $DEBUG ]] && print_stderr $*
}
print_stderr () {
	# works on the darwins and linuxes. not sure about the other bsds or solaris.
	echo $0[$$]: $* > /dev/stderr
}

# Shouldn't really be necessary.
# set -x

#  So, as it happens, the schema returned by aws ec2 describe-images doesn't
#  actually include the date the ami was created, any specific keys re the OS
#  version, and the naming ontology is really poor (it's all freeform rather
#  than organised in any way). Therefore it would seem to not be
#  programmatically possible to 'ascertain' the latest-n-greatest e.g., ubuntu
#  LTS image. So we hard-code this here.
UBUNTU_LTS_AMI_ID="ami-358c955c" # note this is 32-bit

log "creating keypair"
aws ec2 import-key-pair \
	--key-name ${MY_NAME}_key \
	--public-key-material "$(cat ${SSH_KEY}.pub)"

log "creating security group"
aws ec2 create-security-group \
	--group-name ssh_22_inbound \
	--description "port 22 inbound is open"

log "creating security group port 22 inbound rule"
aws ec2 authorize-security-group-ingress \
	--group-name ssh_22_inbound \
	--protocol tcp \
	--port 22 \
	--cidr ${MY_HOME}/${MY_MASK}

log "spinning up new instance"
aws ec2 run-instances \
	--image-id ami-358c955c \
	--key-name ${MY_NAME}_key \
	--instance-type m1.small \
	--placement AvailabilityZone=$AWS_AVAILABILITY_ZONE \
	--security-groups ssh_22_inbound | grep InstanceId | awk '{ print $2 }' | cut -d \" -f 2 | while read instance_id ; do
		log "sleeping ${AMAZON_DERP_DELAY}s to let amazon settle a bit"
		sleep $AMAZON_DERP_DELAY
		log "pulling public dns info from instance id ${instance_id}"
		aws ec2 describe-instances --instance-ids $instance_id | grep PublicDnsName | awk '{ print $2 }' | cut -d \" -f 2 | while read public_hostname ; do
			log "sleeping ${UBUNTU_DERP_DELAY}s to let ubuntu settle a bit"
			sleep $UBUNTU_DERP_DELAY
			log "shelling into ${public_hostname} to frob, chmod, and execute"
			THIS_SSH="ssh -ti $SSH_KEY -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
			# $THIS_SSH do stuff
		done # public_hostname
	done # instance_id


### END
##
#
# log https://www.youtube.com/watch?v=gBzJGckMYO4
exit 0;

# jane@cpan.org // vim:tw=78:ts=2:noet
