#!/usr/local/bin/python

# So, the python interface to Sendak is basically to provide Fabric with details from the
# sequelize ORM we use with nodejs.

# TODO: http://stackoverflow.com/a/419185 per @khandelwal

import psycopg2, sys

dsn = {
	'host'      : 'localhost',
	'database'  : 'infdb',
	'user'      : 'infdb',
	'password'  : '1e72ae149979b3dbc7c347d2053021b2'
}

# Returns a connection object from the .connect() factory
#
dbh = psycopg2.connect( **dsn )

#
#     Column     |           Type           
# ---------------+--------------------------
#  id            | integer                  
#  placeholder   | character varying(255)   
#  createdAt     | timestamp with time zone 
#  updatedAt     | timestamp with time zone 
#  18f_projectId | integer                  
#

sth = dbh.cursor()
sql = 'select id, placeholder from "18f_nodes"'

try: 
	sth.execute( sql )
except psycopg2.Error as e:
	print 'Error pulling object data from database: ' + e.pgerror
	sys.exit() # http://stackoverflow.com/a/73673

# Map the table to a list
#
nodes = [ ];
for row in sth.fetchall():
	pkey, projectid = row.items()
	nodes.append( { 'id' : pkey, 'projectid' : projectid } )   # "append" is python for "push"
