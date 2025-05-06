#!/bin/bash

# Install PHP and Composer (Render-compatible method)
export PHP_INSTALL_DIR="$HOME/php"
mkdir -p $PHP_INSTALL_DIR

# Download and install PHP
curl -sSL https://github.com/shivammathur/php-builder/releases/latest/download/php-8.2-linux-x86_64.tar.gz | tar -xz -C $PHP_INSTALL_DIR

# Add PHP to PATH
export PATH="$PHP_INSTALL_DIR/bin:$PATH"

# Install Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=$PHP_INSTALL_DIR/bin --filename=composer

# Install dependencies
$PHP_INSTALL_DIR/bin/composer install --no-dev --optimize-autoloader

# Laravel optimizations
$PHP_INSTALL_DIR/bin/php artisan config:cache
$PHP_INSTALL_DIR/bin/php artisan route:cache
$PHP_INSTALL_DIR/bin/php artisan view:cache

# Run migrations if DB available
if [ -n "$DB_HOST" ]; then
  $PHP_INSTALL_DIR/bin/php artisan migrate --force --no-interaction
fi