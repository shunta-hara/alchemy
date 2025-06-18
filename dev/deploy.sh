set -a
source .env
set +a

aws s3 sync . "s3://$BUCKET_NAME/" \
  --exclude "*" \
  --include "js/*" \
  --include "js/**" \
  --include "style/*" \
  --include "style/**" \
  --delete

aws s3 sync public/ s3://$BUCKET_NAME/