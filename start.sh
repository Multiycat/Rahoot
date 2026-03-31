#!/bin/bash
set -e

echo "=== Rahoot startup ==="

# Créer les dossiers temporaires pour Nginx
mkdir -p /tmp/nginx/tmp /tmp/nginx/logs
chmod -R 777 /tmp/nginx

# Essayer de créer les dossiers dans /var/lib/nginx aussi (peut échouer si read-only)
mkdir -p /var/lib/nginx/tmp /var/lib/nginx/logs 2>/dev/null || true
chmod -R 777 /var/lib/nginx 2>/dev/null || true

echo "=== Pulling latest changes from GitHub ==="

# Configurer Git
git config --global user.name "Rahoot Bot"
git config --global user.email "bot@rahoot.local"

# Aller dans le répertoire d'application
cd /app

# Initialiser le repo si ce n'est pas déjà fait
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git remote add origin https://github.com/Multiycat/rahoot.git
fi

# Pull les derniers changements
echo "Fetching latest changes..."
git fetch origin main
git pull

echo "=== Building application from latest code ==="

# Installer les dépendances
echo "Installing dependencies..."
pnpm install

# Compiler l'application
echo "Building..."
pnpm run build

echo "=== Build completed successfully ==="

# Lancer supervisord
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
