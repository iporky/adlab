#!/bin/bash

# Check if the replica set is already initialized
IS_INITIALIZED=$(mongosh --quiet --eval 'rs.status().ok' 2>/dev/null)

if [ "$IS_INITIALIZED" != "1" ]; then
  mongosh --eval 'rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongodbpr1:27017" }
    ]
  })'
  echo "------------------- Replica set initiated ---------------------"
else
  echo "------------------- Replica set already initialized ---------------------"
fi