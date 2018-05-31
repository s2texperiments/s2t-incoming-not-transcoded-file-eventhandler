#!/bin/bash

mkdir deploy
chmod 664 deploy
zip -r deploy/s2t-incoming-not-transcoded-file-eventhandler.zip index.js node_modules/
