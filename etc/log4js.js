// log4js config for sendak
//

'use strict';

var log4js = require( 'log4js' );

var config = {
	"appenders": [
		{
			"type": "console",
			"layout": {
				"type": "pattern",
				// Cribbed from ASF:
				//   http://logging.apache.org/log4j/2.x/manual/configuration.html
				'pattern': '%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n',
				"tokens": {
					"pid" : function() { return process.pid; }
				}
			}
		}
	]
};

log4js.configure( config, {} );

var logger = log4js.getLogger( 'Sendak' );
	, logwrap = {
		debug : function (s) { if (process.env.DEBUG != undefined) { logger.debug(s) } },
		info  : function (s) { if (process.env.DEBUG != undefined) { logger.info(s) } },
		warn  : function (s) { if (process.env.DEBUG != undefined) { logger.warn(s) } },
		error : function (s) { if (process.env.DEBUG != undefined) { logger.error(s); return new Error(s) } },
	};

logger.info( 'log4js initialised & configured' );

module.exports = {
	getlogger: function () { return logwrap }
}

// jane@cpan.org // vim:tw=80:ts=2:noet
