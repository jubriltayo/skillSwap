FROM php:8.2-fpm-alpine

# Install only what we need
RUN apk add --no-cache git unzip curl libpq

WORKDIR /app

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create storage directories
RUN mkdir -p storage/app/public storage/logs bootstrap/cache && \
    chmod -R 777 storage bootstrap/cache

# Create symlink for public storage
RUN php artisan storage:link 2>/dev/null || true

# Run migrations on startup
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"]

EXPOSE 8000