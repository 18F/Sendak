# you may want ^W ^W will have to to have these things in your environment

# node aws-sdk
export AWS_ACCESS_KEY_ID=`grep s_access_key ~/.aws/config | cut -d' ' -f 3`
export AWS_SECRET_ACCESS_KEY=`grep aws_sec ~/.aws/config | cut -d' ' -f 3`
export AWS_REGION=`grep region ~/.aws/config | cut -d' ' -f 3`

# sendak {identity,ssh} are going to be different, but there is a
# helpfully-provided identity file in $sendak/etc. I hope.
export SENDAK_IDENTITY=/Users/jane/.ssh/sendak_dsa  # XXX: changeme
export SENDAK_SSH=~/.ssh/sendak_dsa                 # XXX: changeme

# this is the user in github. if you're not 18f, you will want to change this.
export SENDAK_USER=18f-sendak

# this is where sendak builds Things. they will be named
# ${SENDAK_HOME}/sendak-nnnn where nnnn is a "not very random" sequence of
# numbers pulled off POSIX.time().
export SENDAK_HOME=/tmp

# this is ... nevermind.
export SENDAK_DRY_RUN=true

# For clarity's sake, we create this
export SENDAK_ROOT="/Users/jane/dev/sendak"

# And then frob this
export NODE_PATH="${NODE_PATH}:${SENDAK_ROOT}"
