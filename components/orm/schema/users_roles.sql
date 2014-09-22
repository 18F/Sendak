-- ganked from pg_dumpall
create role infdb;
alter role infdb with nosuperuser inherit nocreaterole nocreatedb login noreplication password 'md555047d25568bd70c2a8783513e3e1457';
create role jane;
alter role jane with superuser inherit nocreaterole nocreatedb login noreplication password 'd1bab21b9d44d9245ec231c55ba5d';
create role postgres;
alter role postgres with superuser inherit createrole createdb login replication;

create database infdb with template = template0 owner = postgres;
revoke all on database template1 from public;
revoke all on database template1 from postgres;
grant all on database template1 to postgres;
grant connect on database template1 to public;
