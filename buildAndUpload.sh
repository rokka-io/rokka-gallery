#!/usr/bin/env bash

set -e


cp config-default.js config.js

FOR_ROKKA=true npm run build
aws s3 sync --delete --cache-control "max-age=300, public" --profile rokka --acl public-read  dist/ s3://rokka-gallery/gallery/
aws s3 cp --cache-control "max-age=300, public" --profile rokka --acl public-read  dist/index.html s3://rokka-gallery/

aws cloudfront --profile rokka create-invalidation  --distribution-id E389UMLNXZS9QN  --paths '/gallery/*' > /dev/null

echo ""
echo "The site can be reached at: "
echo "https://rokka.io/gallery/"
echo ""
