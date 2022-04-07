#!/bin/sh

docker build testing --tag aws-sam

docker run -d --rm \
  -v "$(pwd):/app:ro" \
  -v "/var/run/docker.sock:/var/run/docker.sock:ro" \
  -v "$HOME/.aws:/root/.aws:ro" \
  --name aws-sam \
  --network host \
  aws-sam tail -f /dev/null

docker exec -it aws-sam bash

docker stop aws-sam
