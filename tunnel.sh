#!/bin/bash
echo "Running tunnel"
port=$(cat .env | grep -o -E "[0-9]{4}" | head -n 1)
ssh -R 80:localhost:$port localhost.run &> text
