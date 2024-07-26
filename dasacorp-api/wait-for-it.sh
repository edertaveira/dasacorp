#!/usr/bin/env bash

# wait-for-it.sh -- A script that will wait for a TCP host/port to become available

set -e

TIMEOUT=60

HOST=$1
PORT=$2
shift 2
COMMAND=$@

echo "Waiting for $HOST:$PORT... Command: $COMMAND"

for i in `seq $TIMEOUT` ; do
  nc -z $HOST $PORT > /dev/null 2>&1
  result=$?
  if [ $result -eq 0 ] ; then
    exec $COMMAND
  fi
  sleep 1
done

echo "Timeout reached while waiting for $HOST:$PORT"
exit 1
