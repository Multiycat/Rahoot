#!/bin/sh
set -e

echo "=== Rahoot startup ==="

BASE_DIR="/home/container"

# =========================
# NGINX (100% writable)
# =========================
mkdir -p $BASE_DIR/nginx/tmp $BASE_DIR/nginx/logs
chmod -R 777 $BASE_DIR/nginx

# =========================
# CONFIG
# =========================
mkdir -p $BASE_DIR/config/quizz
chmod -R 777 $BASE_DIR/config

# =========================
# UPDATE SYSTEM
# =========================
echo "=== Checking for updates from GitHub ==="

git config --global user.name "Rahoot Bot"
git config --global user.email "bot@rahoot.local"

UPDATE_DIR="$BASE_DIR/update"
mkdir -p "$UPDATE_DIR"
cd "$UPDATE_DIR"

# ✅ FIX: git clone au lieu de git push
if ! git clone --depth 1 https://github.com/Multiycat/rahoot.git . 2>/dev/null; then
  echo "Failed to clone, skipping update"
else
  echo "Checking for updated source files..."

  # Copier uniquement la config
  cp -r ./config/* $BASE_DIR/config/ 2>/dev/null || true

  echo "Config files updated"
fi

cd $BASE_DIR/app

# Nettoyage
rm -rf "$UPDATE_DIR" 2>/dev/null || true

echo "=== Application ready ==="

# =========================
# START
# =========================
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /home/container/app/docker/supervisord.conf/
