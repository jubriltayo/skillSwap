FROM ubuntu:22.04

# 1. Add PHP repository
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    ca-certificates \
    gnupg \
    && LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php \
    && apt-get clean

# 2. Install PHP and extensions
RUN apt-get update && apt-get install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-pgsql \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    && apt-get clean

# 3. Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# 4. Set up Laravel
WORKDIR /var/www
COPY . .

# 5. Install dependencies
RUN composer install --no-dev --optimize-autoloader

# 6. Fix permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# 7. Start command
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]