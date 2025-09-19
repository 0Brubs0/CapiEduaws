#!/bin/bash

# 🦫 Script de Deploy CapiEdu na AWS
set -e

# Configurações
PROJECT_NAME="capiedu"
REGION="us-east-1"
BUCKET_NAME="${PROJECT_NAME}-$(date +%s)"

echo "🦫 Iniciando deploy do CapiEdu na AWS..."

# 1. Criar bucket S3
echo "📦 Criando bucket S3..."
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 2. Configurar bucket para website estático
echo "🌐 Configurando website estático..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 3. Upload dos arquivos
echo "⬆️ Fazendo upload dos arquivos..."
aws s3 sync . s3://$BUCKET_NAME \
  --exclude "*.sh" \
  --exclude "*.md" \
  --exclude ".git/*" \
  --exclude "deploy-*" \
  --cache-control "text/html:max-age=300,text/css:max-age=31536000,application/javascript:max-age=31536000"

# 4. Configurar política pública
echo "🔓 Configurando acesso público..."
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

# 5. Criar distribuição CloudFront
echo "🚀 Criando distribuição CloudFront..."
DISTRIBUTION_CONFIG='{
  "CallerReference": "'$BUCKET_NAME'",
  "Comment": "CapiEdu CDN",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-'$BUCKET_NAME'",
        "DomainName": "'$BUCKET_NAME'.s3-website-'$REGION'.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-'$BUCKET_NAME'",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}'

DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config "$DISTRIBUTION_CONFIG" --query 'Distribution.Id' --output text)

echo "✅ Deploy concluído!"
echo ""
echo "🌐 URLs de acesso:"
echo "S3 Website: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "CloudFront: https://$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"
echo ""
echo "📝 Informações importantes:"
echo "Bucket: $BUCKET_NAME"
echo "Região: $REGION"
echo "CloudFront ID: $DISTRIBUTION_ID"
echo ""
echo "⏰ CloudFront pode levar até 15 minutos para ficar ativo"
echo "🦫 CapiEdu está no ar!"