#!/usr/bin/env sh

source ./common.sh

NODE_ENV=$NODE_ENV node --use_strict --experimental-vm-modules $NODE_FLAGS \
  index.js \
  --config config/service-template.json "$@"
