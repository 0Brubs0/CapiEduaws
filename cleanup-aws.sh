#!/bin/bash

# 🦫 Script para limpar recursos AWS
set -e

echo "🧹 Limpando recursos AWS do CapiEdu..."

# Listar buckets do projeto
echo "📦 Buckets encontrados:"
aws s3 ls | grep capiedu

echo ""
read -p "Digite o nome do bucket para remover: " BUCKET_NAME

if [ -z "$BUCKET_NAME" ]; then
  echo "❌ Nome do bucket não informado"
  exit 1
fi

# Remover arquivos e bucket
echo "🗑️ Removendo arquivos..."
aws s3 rm s3://$BUCKET_NAME --recursive

echo "🗑️ Removendo bucket..."
aws s3 rb s3://$BUCKET_NAME

echo "✅ Recursos removidos com sucesso!"