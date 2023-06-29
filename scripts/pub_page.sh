#!/bin/bash

echo "build pages"
yarn build 
echo "clean old pages"
rm -rf docs/index.html docs/assets/ 
echo "copy generated files"
cp -R dist/index.html dist/assets docs/
git add docs
now=$(date +%Y%m%d%H%m%S)
git commit -m "publish pages ${now} "
git push origin main 