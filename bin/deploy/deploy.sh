#!/bin/bash
set -ex
PATH=$PATH:/home/ubuntu/n/bin:/home/ubuntu/bin
TARGET='/home/ubuntu/mwm'
cd $TARGET

pwd
whoami

./bin/nginx/create_lnk.sh && sudo systemctl restart nginx

pm2 reload ecosystem.config.json
