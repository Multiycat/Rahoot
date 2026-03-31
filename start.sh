#!/bin/bash
set -e

echo "=== Rahoot startup ==="

# Créer les dossiers temporaires pour Nginx
mkdir -p /tmp/nginx/tmp /tmp/nginx/logs
chmod -R 777 /tmp/nginx

# Essayer de créer les dossiers dans /var/lib/nginx aussi (peut échouer si read-only)
mkdir -p /var/lib/nginx/tmp /var/lib/nginx/logs 2>/dev/null || true
chmod -R 777 /var/lib/nginx 2>/dev/null || true

# Créer le répertoire pnpm
mkdir -p /tmp/pnpm-store
export PNPM_HOME="/tmp/pnpm-store"
export PATH="$PNPM_HOME:$PATH"

echo "=== Pulling latest changes from GitHub ==="

# Configurer Git
git config --global user.name "Rahoot Bot"
git config --global user.email "bot@rahoot.local"

# Utiliser /tmp pour le code (writable)
WORK_DIR="/tmp/rahoot-app"

# Supprimer et recréer le répertoire de travail
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo "Cloning repository from GitHub..."
git clone https://github.com/Multiycat/rahoot.git .

echo "=== Building application from latest code ==="

# Installer les dépendances
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Compiler l'application
echo "Building..."
pnpm run build

echo "=== Build completed successfully ==="

# Supprimer l'ancien contenu de /app et créer des symlinks
echo "Setting up application directories..."
rm -rf /app/* 2>/dev/null || true

# Copier les fichiers compilés vers /app
mkdir -p /app/packages/web/dist
mkdir -p /app/packages/socket/dist
mkdir -p /app/config

cp -r "$WORK_DIR/packages/web/dist"/* /app/packages/web/dist/ 2>/dev/null || true
cp -r "$WORK_DIR/packages/socket/dist"/* /app/packages/socket/dist/ 2>/dev/null || true
cp -r "$WORK_DIR/config"/* /app/config/ 2>/dev/null || true

echo "Application ready at /app"

# Lancer supervisord
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
