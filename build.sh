#!/bin/sh

# npm run lint:fix

rm -rf dist/*
./node_modules/typescript/bin/tsc --project tsconfig.build.json

cp package.json LICENSE README.md dist
# cd dist
# npm publish --dry-run