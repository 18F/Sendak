# this is almost certainly not the place for it but i'm not sure where else
# to put common files right now.
#

# Debugging utility
#
log () {
	# If this annoys, just swap this to logger(1)
	[[ $DEBUG ]] && print_stderr $*
}
print_stderr () {
	# works on the darwins and linuxes. not sure about the other bsds or solaris.
	echo $0[$$]: $* > /dev/stderr
}

# jane@cpan.org // vim:tw=78:ts=2:noet
