#!/bin/bash

# Install PHP and Composer without sudo
apt-get update && apt-get install -y \
    php8.2 \
    php8.2-pgsql \
    composer

# Install dependencies
composer install --no-dev --optimize-autoloader

# Cache and optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations if DB is configured
if [ -n "$DB_HOST" ]; then
    php artisan migrate --force --no-interaction
fi