FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    git \
    unzip \
    curl \
    libpq \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apk del libpq-dev

WORKDIR /app

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create storage directories with proper permissions
RUN mkdir -p \
    storage/app/public/avatars \
    storage/logs \
    bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    && chmod -R 775 storage bootstrap/cache

# Create symlink for storage
RUN php artisan storage:link || true

# Optimize Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]