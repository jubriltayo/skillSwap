#!/bin/bash

# Install PHP 8.2 via Node.js
export PHP_INSTALL_DIR="$HOME/php"
mkdir -p $PHP_INSTALL_DIR
curl -sS https://raw.githubusercontent.com/shivammathur/setup-php/master/setup-php.sh | bash -s -- \
  --php-version=8.2 \
  --install-dir=$PHP_INSTALL_DIR \
  --no-interaction

# Add PHP to PATH
export PATH="$PHP_INSTALL_DIR/bin:$PATH"

# Install Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=$PHP_INSTALL_DIR/bin --filename=composer

# Install dependencies
$PHP_INSTALL_DIR/bin/composer install --no-dev --optimize-autoloader

# Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations if DB available
if [ -n "$DB_HOST" ]; then
  php artisan migrate --force --no-interaction
fi
