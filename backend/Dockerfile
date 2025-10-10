FROM php:8.2-cli-alpine

# Install system dependencies and SQLite
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy dependency files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application files
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs database \
    && chmod -R 775 storage bootstrap/cache database

# Create SQLite database
RUN touch database/database.sqlite \
    && chmod 666 database/database.sqlite

# Generate optimized autoloader and cache (with error handling)
RUN composer dump-autoload --optimize \
    && php artisan config:cache \
    && php artisan route:cache \
    && (php artisan view:cache || true)

EXPOSE 8000

# Start PHP built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]