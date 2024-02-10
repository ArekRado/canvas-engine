#!/bin/sh

# npm run lint:fix

rm -rf dist/*
./node_modules/typescript/bin/tsc --project tsconfig.build.json

npm run build
cp LICENSE README.md dist

# cd dist
# npm publish

