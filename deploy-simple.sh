#!/bin/bash

# 🦫 Deploy Simples - Apenas S3
set -e

BUCKET_NAME="capiedu-$(date +%s)"
REGION="us-east-1"

echo "🦫 Deploy simples do CapiEdu..."

# Criar e configurar bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION
aws s3 website s3://$BUCKET_NAME --index-document index.html

# Upload arquivos
aws s3 sync . s3://$BUCKET_NAME --exclude "*.sh" --exclude "*.md" --exclude ".git/*"

# Tornar público
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
  }]
}'

echo "✅ Deploy concluído!"
echo "🌐 URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"