#!/bin/bash
set -e

echo "=== Rahoot startup ==="

# Créer les dossiers manquants pour Nginx dans /tmp (qui est toujours writable)
mkdir -p /tmp/nginx/tmp /tmp/nginx/logs
chmod -R 777 /tmp/nginx

# Essayer de créer les dossiers dans /var/lib/nginx aussi (peut échouer si read-only)
mkdir -p /var/lib/nginx/tmp /var/lib/nginx/logs
chmod -R 777 /var/lib/nginx 2>/dev/null || true

# Mettre à jour le code depuis Git
echo "Pulling latest changes from Git..."
cd /app
git pull origin main

# Installer les dépendances
echo "Installing dependencies..."
pnpm install

# Compiler l'application
echo "Building application..."
pnpm run build

echo "=== Build completed successfully ==="

# Lancer supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
