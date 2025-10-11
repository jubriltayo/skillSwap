FROM php:8.2-fpm-alpine

# Install only what we need
RUN apk add --no-cache git unzip curl libpq libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql && \
    apk del libpq-dev

WORKDIR /app

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create storage directories with full permissions
RUN mkdir -p storage/app/public storage/logs bootstrap/cache storage/framework/{cache,sessions,views} && \
    chmod -R 777 storage bootstrap/cache

# Don't run anything else - just start the server
EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
