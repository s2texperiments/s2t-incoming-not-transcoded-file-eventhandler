#!/bin/bash

mkdir deploy
zip -r deploy/s3-metadata-eventhandler.zip *.js node_modules/
