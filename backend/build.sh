#!/bin/bash

# 1. Install PHP from trusted source
PHP_DIR="$HOME/php"
mkdir -p $PHP_DIR
cd $PHP_DIR

# Download pre-compiled PHP binary (Ubuntu 20.04 compatible)
curl -sSL https://github.com/shivammathur/php-builder/releases/download/php-8.2.20/php-8.2.20-linux-x86_64.tar.gz | tar -xz --strip-components=1

# Verify PHP installation
./bin/php -v || exit 1

# 2. Install Composer
curl -sS https://getcomposer.org/installer | ./bin/php -- --install-dir=./bin --filename=composer
./bin/composer -V || exit 1

# 3. Install project dependencies
cd $HOME/render/project/src/backend
../../php/bin/composer install --no-dev --optimize-autoloader

# 4. Laravel optimizations
../../php/bin/php artisan config:cache
../../php/bin/php artisan route:cache
../../php/bin/php artisan view:cache

# 5. Run migrations (if DB configured)
if [ -n "$DB_HOST" ]; then
  ../../php/bin/php artisan migrate --force --no-interaction
fi