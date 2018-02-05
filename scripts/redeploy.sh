#!/bin/sh
cd ~/webapps/fitcal
git pull origin master
yarn
npm run build
forever restart fitcal
