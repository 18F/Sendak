// base configuration for sendak
//

'use strict';

var global = { };

global.logger = require( '../etc/log4js.js' ).getlogger();

module.exports = {
	getcf:     function () { return global },
	getlogger: function () { return global.logger }
}

// jane@cpan.org // vim:tw=80:ts=2:noet
