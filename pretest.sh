#!/bin/bash

if [ "$CIRCLECI" != true ]
  then
    psql spark -f ./test/utils/schema.sql
fi
