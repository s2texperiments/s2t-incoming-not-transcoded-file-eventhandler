#!/bin/bash

mkdir deploy
sudo chown -R travis:travis /home/travis/
zip -r deploy/s2t-incoming-not-transcoded-file-eventhandler.zip index.js node_modules/
