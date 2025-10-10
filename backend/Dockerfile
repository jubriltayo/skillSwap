FROM php:8.2-cli-alpine

# Install system dependencies and SQLite
RUN apk add --no-cache sqlite sqlite-dev
RUN docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy dependency files
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs database
RUN chmod -R 775 storage bootstrap/cache database

# Create SQLite database
RUN touch database/database.sqlite
RUN chmod 666 database/database.sqlite

# Generate optimized autoloader
RUN composer dump-autoload --optimize

EXPOSE 8000

# Start command
CMD sh -c "php artisan key:generate --force && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"