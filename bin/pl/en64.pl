#!/usr/bin/perl

# Super quick encode/decode base64 from a pipe
#

use 5.14.0;

use MIME::Base64;
use File::Basename;

my $old_irs = $/;
undef $/;

my $input = <>;


my $invocation = basename $0;
$invocation =~ s{([^/.])\.pl}{$1};

$/ = $old_irs;

my $actions = {
	en64 => sub {
		# We are encoding
		#
		say +encode_base64 shift ;
		exit 0;
	},
	de64 => sub {
		# We are decoding
		#
		say +decode_base64 shift ;
		exit 0;
	},
};

$actions->{$invocation}->( $input );

warn "Failed to determine operation. Abort.\n";
exit -255;

# jane@cpan.org // vim:tw=80:ts=2:noet
