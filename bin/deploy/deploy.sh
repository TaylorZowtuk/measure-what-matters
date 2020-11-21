#!/bin/bash
set -ex
PATH=$PATH:/home/ubuntu/n/bin:/home/ubuntu/bin

../nginx/create_lnk.sh && sudo systemctl restart nginx

pm2 reload all
