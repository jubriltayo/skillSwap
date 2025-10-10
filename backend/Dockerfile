# Use official PHP image with extensions
FROM php:8.2-cli

# Install required extensions
RUN apt-get update \
    && apt-get install -y libpq-dev git unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy app files
COPY . .

# Create complete directory structure with proper permissions
RUN mkdir -p bootstrap/cache \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    && chmod -R 775 bootstrap/cache storage \
    && chown -R www-data:www-data bootstrap/cache storage

# Run post-install scripts
RUN composer dump-autoload --optimize

# Expose port
EXPOSE 8000

# Start server
CMD php artisan config:cache && php artisan view:clear && php artisan serve --host=0.0.0.0 --port=8000