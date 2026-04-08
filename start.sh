#!/bin/sh
set -e

echo "=== Rahoot startup ==="

# Créer les dossiers temporaires pour Nginx
mkdir -p /tmp/nginx/tmp /tmp/nginx/logs
chmod -R 777 /tmp/nginx

# Essayer de créer les dossiers dans /var/lib/nginx aussi (peut échouer si read-only)
mkdir -p /var/lib/nginx/tmp /var/lib/nginx/logs 2>/dev/null || true
chmod -R 777 /var/lib/nginx 2>/dev/null || true

# Créer le répertoire config dans /tmp (writable)
mkdir -p /tmp/config/quizz
chmod -R 777 /tmp/config

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
  echo "Checking for updated source files..."

  # Copier les fichiers source s'ils existent
  # Note: Le répertoire dist n'existe pas dans le repo, donc on copie juste les sources
  # Pour les mises à jour en production, il faudrait soit:
  # 1. Reconstruire avec pnpm (trop lourd pour le runtime)
  chmod -R 777 /app 2>/dev/null || true
  # 2. Avoir les dist pré-compilés dans le repo

  cp -r ./config/* /tmp/config/ 2>/dev/null || true
  echo "Config files checked"
fi

cd /app

# Nettoyer les fichiers temporaires
rm -rf "$UPDATE_DIR" 2>/dev/null || true

echo "=== Application ready ==="

# Lancer supervisord
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
