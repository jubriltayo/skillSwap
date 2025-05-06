#!/bin/bash

# Install PHP and dependencies
sudo apt-get update
sudo apt-get install -y php8.2 php8.2-common php8.2-cli php8.2-pgsql composer

# Install project dependencies
composer install --no-dev --optimize-autoloader

# Optimize Laravel
php artisan optimize:clear

# Run migrations (only if DB credentials are set)
if [ -n "$DB_HOST" ]; then
    php artisan migrate --force --no-interaction
fi