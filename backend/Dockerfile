# ===== BASE IMAGE =====
FROM ubuntu:22.04

# ===== SYSTEM SETUP =====
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    ca-certificates \
    gnupg \
    && LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php \
    && apt-get clean

# ===== PHP & EXTENSIONS =====
RUN apt-get update && apt-get install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-pgsql \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    php8.2-opcache \
    php8.2-bcmath \
    && apt-get clean

# ===== POSTGRESQL CLIENT =====
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && apt-get clean

# ===== COMPOSER =====
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer \
    --2

# ===== APPLICATION SETUP =====
WORKDIR /var/www
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader \
    && composer dump-autoload --optimize

# ===== PERMISSIONS =====
RUN chown -R www-data:www-data storage bootstrap/cache

# ===== DATABASE MIGRATION =====
# This will run when the container starts
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# ===== HEALTH CHECK =====
COPY health-check.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/health-check.sh
HEALTHCHECK --interval=30s --timeout=3s \
    CMD /usr/local/bin/health-check.sh

# ===== RUNTIME CONFIGURATION =====
EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]