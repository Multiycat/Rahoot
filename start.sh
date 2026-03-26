#!/bin/bash
set -e

# Créer les dossiers manquants pour Nginx et donner les droits
mkdir -p /var/lib/nginx/tmp /var/lib/nginx/logs
chmod -R 777 /var/lib/nginx

# Lancer supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
