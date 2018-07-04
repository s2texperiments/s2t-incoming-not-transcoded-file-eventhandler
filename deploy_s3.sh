#!/bin/bash

mkdir deploy
zip -r deploy/s2t-s3-eventhandler.zip index.js s3Api.js snsApi.js node_modules/
