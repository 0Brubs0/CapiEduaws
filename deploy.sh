#!/bin/bash

# Script de deploy para AWS S3
BUCKET_NAME="capiedu-app-$(date +%s)"
REGION="us-east-1"

echo "🦫 Iniciando deploy do CapiEdu..."

# 1. Criar bucket S3
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 2. Configurar bucket para hosting estático
aws s3 website s3://$BUCKET_NAME --index-document index.html

# 3. Upload dos arquivos
aws s3 sync . s3://$BUCKET_NAME --exclude "*.sh" --exclude "*.json" --exclude "README.md" --exclude ".git/*"

# 4. Tornar arquivos públicos
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
    }
  ]
}'

echo "✅ Deploy concluído!"
echo "🌐 URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"