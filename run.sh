#!/bin/bash
echo "Running"
port=$(cat .env | grep -o -E "[0-9]{4}" | head -n 1)
url=$(cat text | grep -Eo "https?://\S+link")
if [ ! -z $url ]
then
    echo $url
    echo "PORT=$port" > .env
    echo "SSH=$url" >> .env
else
    echo "No URL specified"
fi
rm text