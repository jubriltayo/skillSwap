# Use official PHP image with extensions
FROM php:8.2-cli

# Install required extensions
RUN apt-get update \
    && apt-get install -y libpq-dev git unzip \
    && docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy app files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose port
EXPOSE 8000

RUN mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} \
    && chmod -R 775 bootstrap/cache storage \
    && chown -R www-data:www-data bootstrap/cache storage

# Start server
CMD php artisan serve --host=0.0.0.0 --port=8000
