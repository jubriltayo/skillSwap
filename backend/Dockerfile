# Optimized single-container Laravel + PostgreSQL for Render free tier
FROM php:8.2-fpm

# Install system dependencies and PostgreSQL
RUN apt-get update && apt-get install -y \
    postgresql-15 \
    postgresql-contrib-15 \
    libpq-dev \
    nginx \
    supervisor \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy dependency files
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application
COPY . .

# Set permissions
RUN mkdir -p bootstrap/cache \
    storage/app/public \
    storage/framework/{cache/data,sessions,views} \
    storage/logs \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Optimize
RUN composer dump-autoload --optimize && \
    php artisan package:discover --ansi || true

# PostgreSQL setup
RUN mkdir -p /var/lib/postgresql/data /var/run/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql /var/run/postgresql && \
    chmod 750 /var/lib/postgresql/data

# Initialize database
USER postgres
RUN /usr/lib/postgresql/15/bin/initdb -D /var/lib/postgresql/data && \
    echo "host all all 127.0.0.1/32 trust" >> /var/lib/postgresql/data/pg_hba.conf && \
    echo "host all all ::1/128 trust" >> /var/lib/postgresql/data/pg_hba.conf && \
    /usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/data -o "-c listen_addresses='localhost'" start && \
    sleep 3 && \
    psql -c "CREATE USER laravel WITH PASSWORD 'secret' CREATEDB;" && \
    psql -c "CREATE DATABASE laravel OWNER laravel;" && \
    /usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/data stop

USER root

# Nginx config
RUN echo 'server {\n\
    listen 8000;\n\
    server_name _;\n\
    root /var/www/html/public;\n\
    index index.php;\n\
    client_max_body_size 20M;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.php?$query_string;\n\
    }\n\
\n\
    location ~ \.php$ {\n\
        fastcgi_pass 127.0.0.1:9000;\n\
        fastcgi_index index.php;\n\
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;\n\
        include fastcgi_params;\n\
    }\n\
\n\
    location ~ /\.(?!well-known).* {\n\
        deny all;\n\
    }\n\
}' > /etc/nginx/sites-available/default

# Supervisor config
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
logfile=/dev/stdout\n\
logfile_maxbytes=0\n\
\n\
[program:postgresql]\n\
command=/usr/lib/postgresql/15/bin/postgres -D /var/lib/postgresql/data\n\
user=postgres\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:php-fpm]\n\
command=/usr/local/sbin/php-fpm --nodaemonize\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:nginx]\n\
command=/usr/sbin/nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:laravel-init]\n\
command=/var/www/html/init.sh\n\
autostart=true\n\
autorestart=false\n\
startsecs=0\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0' > /etc/supervisor/conf.d/supervisord.conf

# Init script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Waiting for PostgreSQL..."\n\
until pg_isready -h localhost -U laravel 2>/dev/null; do sleep 1; done\n\
echo "PostgreSQL ready!"\n\
cd /var/www/html\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
php artisan migrate --force --no-interaction\n\
php artisan db:seed --force --no-interaction || true\n\
echo "Laravel initialized!"' > /var/www/html/init.sh && \
chmod +x /var/www/html/init.sh

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]