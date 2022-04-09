#!/bin/sh

if [ -z $1 ] || [ -z $2 ] || [ -z $3 ]; then
  echo "3 values needed"
  exit
fi

gh secret set AWS_ACCESS_KEY_ID -b $1
gh secret set AWS_SECRET_ACCESS_KEY -b $2
gh secret set NEWS_API -b $3
