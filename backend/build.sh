#!/bin/bash

# 1. Setup directories
PHP_DIR="$HOME/php"
mkdir -p $PHP_DIR
cd $PHP_DIR

# 2. Download PHP from official Render cache
curl -sSL https://render-php-binary-cache.s3.amazonaws.com/php-8.2.20-render-compatible.tar.gz | tar -xz

# 3. Verify PHP
$PHP_DIR/bin/php -v || { echo "PHP installation failed"; exit 1; }

# 4. Install Composer
curl -sS https://getcomposer.org/installer | $PHP_DIR/bin/php -- --install-dir=$PHP_DIR/bin --filename=composer
$PHP_DIR/bin/composer -V || { echo "Composer installation failed"; exit 1; }

# 5. Install Laravel dependencies
cd $HOME/render/project/src/backend
$PHP_DIR/bin/composer install --no-dev --optimize-autoloader

# 6. Laravel optimizations
$PHP_DIR/bin/php artisan config:cache
$PHP_DIR/bin/php artisan route:cache
$PHP_DIR/bin/php artisan view:cache
