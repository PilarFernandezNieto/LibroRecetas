#!/bin/bash
# Ejecutar en el servidor, desde la raíz de la app Laravel desplegada
# (ej: ./deploy.sh ..., estando dentro de esa carpeta).
#
# Uso:
#   ./deploy.sh pre    Antes de subir el frontend por FileZilla: vacía public/assets
#                      para no acumular builds antiguos de Vite (nombres con hash).
#   ./deploy.sh post   Después de subir los cambios: limpia cachés de Laravel
#                      y, si se indica, instala dependencias/migra la BD.
#
# Ejemplos:
#   ./deploy.sh pre
#   ./deploy.sh post
#   ./deploy.sh post --composer --migrate

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$APP_DIR/public"
ASSETS_DIR="$PUBLIC_DIR/assets"

log() {
  echo "[deploy] $1"
}

cmd_pre() {
  if [ ! -d "$ASSETS_DIR" ]; then
    log "No existe $ASSETS_DIR, nada que limpiar."
    return
  fi

  log "Vaciando $ASSETS_DIR (build antiguo del frontend)..."
  find "$ASSETS_DIR" -mindepth 1 -delete
  log "Listo. Ahora sube el nuevo dist/ (index.html + assets/) por FileZilla."
}

cmd_post() {
  local run_composer=false
  local run_migrate=false

  for arg in "$@"; do
    case "$arg" in
      --composer) run_composer=true ;;
      --migrate) run_migrate=true ;;
      *)
        log "Argumento desconocido: $arg"
        exit 1
        ;;
    esac
  done

  cd "$APP_DIR"

  if [ "$run_composer" = true ]; then
    log "Instalando dependencias de Composer (producción)..."
    composer install --no-dev --optimize-autoloader
  fi

  if [ "$run_migrate" = true ]; then
    log "Ejecutando migraciones pendientes..."
    php artisan migrate --force
  fi

  log "Limpiando cachés de Laravel..."
  php artisan config:clear
  php artisan cache:clear
  php artisan route:clear
  php artisan view:clear

  log "Regenerando cachés de producción..."
  php artisan config:cache
  php artisan route:cache

  log "Despliegue completado."
}

case "${1:-}" in
  pre)
    cmd_pre
    ;;
  post)
    shift
    cmd_post "$@"
    ;;
  *)
    echo "Uso: $0 {pre|post} [--composer] [--migrate]"
    exit 1
    ;;
esac
