FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    git \
    unzip \
    curl \
    libpq \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy dependency files
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application files
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p bootstrap/cache \
    storage/app/public \
    storage/framework/{cache/data,sessions,views} \
    storage/logs \
    database \
    && chmod -R 777 storage bootstrap/cache database

# Generate optimized autoloader
RUN composer dump-autoload --optimize && \
    php artisan package:discover --ansi || true

# Configure Nginx
RUN echo 'server {\n\
    listen 8000;\n\
    server_name _;\n\
    root /var/www/html/public;\n\
    index index.php;\n\
\n\
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
        fastcgi_read_timeout 300;\n\
    }\n\
\n\
    location ~ /\.(?!well-known).* {\n\
        deny all;\n\
    }\n\
\n\
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}' > /etc/nginx/http.d/default.conf

# Configure Supervisor to manage processes
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
logfile=/dev/stdout\n\
logfile_maxbytes=0\n\
loglevel=info\n\
\n\
[program:php-fpm]\n\
command=/usr/local/sbin/php-fpm --nodaemonize\n\
priority=1\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
stopasgroup=true\n\
\n\
[program:nginx]\n\
command=/usr/sbin/nginx -g "daemon off;"\n\
priority=2\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
stopasgroup=true\n\
\n\
[program:laravel-init]\n\
command=/var/www/html/init.sh\n\
priority=999\n\
autostart=true\n\
autorestart=false\n\
startsecs=0\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0' > /etc/supervisord.conf

# Initialization script
RUN echo '#!/bin/sh\n\
set -e\n\
\n\
cd /var/www/html\n\
\n\
echo "================================"\n\
echo "Laravel Initialization Starting"\n\
echo "================================"\n\
\n\
echo "Creating SQLite database..."\n\
touch database/database.sqlite\n\
chmod 666 database/database.sqlite\n\
\n\
echo "Caching configuration..."\n\
php artisan config:cache || true\n\
\n\
echo "Caching routes..."\n\
php artisan route:cache || true\n\
\n\
echo "Caching views..."\n\
php artisan view:cache || true\n\
\n\
echo "Running migrations..."\n\
php artisan migrate --force --no-interaction\n\
\n\
echo "Running seeders..."\n\
php artisan db:seed --force --no-interaction || true\n\
\n\
echo "================================"\n\
echo "Laravel Ready!"\n\
echo "================================"\n\
' > /var/www/html/init.sh && chmod +x /var/www/html/init.sh

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]