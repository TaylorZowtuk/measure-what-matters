#!/bin/bash
DIR="$(cd "$(dirname "$0")"; pwd)"
TARGET=""

if [ -d /etc/nginx/ ]; then
    TARGET="/etc/nginx"
fi

if [ -d /usr/local/etc/nginx/ ]; then
    TARGET="/usr/local/etc/nginx"
fi

if [ $# -ge 1 ]; then
  TARGET=$1
fi

if [ "$TARGET" = "" ]; then 
    echo "Nginx /etc folder not found! Exiting"
    exit 1
fi

mkdir -p "${TARGET}/sites-enabled"

ln -sf "${DIR}/production.conf" "${TARGET}/sites-enabled/default.conf"