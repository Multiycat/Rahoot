#!/bin/bash
set -e

echo "=== Rahoot startup ==="

# Créer les dossiers temporaires pour Nginx
mkdir -p /tmp/nginx/tmp /tmp/nginx/logs
chmod -R 777 /tmp/nginx

# Essayer de créer les dossiers dans /var/lib/nginx aussi (peut échouer si read-only)
mkdir -p /var/lib/nginx/tmp /var/lib/nginx/logs 2>/dev/null || true
chmod -R 777 /var/lib/nginx 2>/dev/null || true

echo "=== Checking for updates from GitHub ==="

# Configurer Git
git config --global user.name "Rahoot Bot"
git config --global user.email "bot@rahoot.local"

# Utiliser /tmp pour les mises à jour
UPDATE_DIR="/tmp/rahoot-update"
mkdir -p "$UPDATE_DIR"
cd "$UPDATE_DIR"

# Cloner les sources pour vérifier les mises à jour
if ! git clone --depth 1 https://github.com/Multiycat/rahoot.git . 2>/dev/null; then
  echo "Failed to clone, skipping update"
else
  # Copier les fichiers compilés vers /app
  echo "Updating application files..."
  
  # Nettoyer l'espace avant de copier
  rm -rf /app/packages/web/dist
  rm -rf /app/packages/socket/dist
  rm -rf /app/config
  
  # Copier les nouveaux fichiers
  mkdir -p /app/packages/web/dist
  mkdir -p /app/packages/socket/dist
  mkdir -p /app/config
  
  cp -r ./packages/web/dist/* /app/packages/web/dist/ 2>/dev/null || true
  cp -r ./packages/socket/dist/* /app/packages/socket/dist/ 2>/dev/null || true
  cp -r ./config/* /app/config/ 2>/dev/null || true
  
  echo "Application files updated"
fi

# Nettoyer les fichiers temporaires
rm -rf "$UPDATE_DIR"

echo "=== Application ready ==="

# Lancer supervisord
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
