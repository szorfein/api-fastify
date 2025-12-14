# Postgresql

Some tricks to hardening postgresql

## new user bob

    sudo -u postgres createuser -P bob
    Enter password for new role:
    Enter it again:

## new database

    sudo -u postgres createdb thisdb
    sudo -u postgres createdb -O bob thisdb

## give permission

    sudo -u postgres psql
    GRANT ALL PRIVILEGES on DATABASE thisdb to bob;
    GRANT SELECT, INSERT, UPDATE, DELETE on ALL TABLES IN GRANT

read-only

    GRANT SELECT on ALL TABLES IN SCHEMA public to bob;

## Config file

    $EDITOR /var/lib/psql/data/pg_hba.conf

```conf
local all all // unix socket only
host all all 127.0.0.1/32 // IPV4
host all all ::1/128 // IPV6
host bob all 10.0.0.0/8 // specific user - ip
```

## Enable SSL

Open the config file and add

    ssl = on
    ssl_ciphers = ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256

Change in options `host` by `hostssl`

    hostssl all all 10.0.0.0/8 // specific ip

TODO: Search the last cipher recommanded for pg
