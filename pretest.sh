#!/bin/bash

if [CIRCLECI=true]; then
  exit
else
  psql spark -f ./test/utils/schema.sql-queries
fi
