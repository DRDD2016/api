#!/bin/bash

if [ $CIRCLECI -eq true ]; then
  exit
else
  psql spark -f ./test/utils/schema.sql
fi
