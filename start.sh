#!/bin/bash
set -e

echo "=== Rahoot startup ==="

# Créer les dossiers manquants pour Nginx et donner les droits
mkdir -p /var/lib/nginx/tmp /var/lib/nginx/logs
chmod -R 777 /var/lib/nginx

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
