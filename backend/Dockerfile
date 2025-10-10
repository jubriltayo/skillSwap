FROM php:8.2-fpm

# Install system dependencies
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

# PostgreSQL data directory setup
RUN mkdir -p /var/lib/postgresql/data /var/run/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql /var/run/postgresql && \
    chmod 700 /var/lib/postgresql/data

# Initialize PostgreSQL database cluster
USER postgres
RUN /usr/lib/postgresql/15/bin/initdb -D /var/lib/postgresql/data -U postgres
USER root

# Configure PostgreSQL to accept local connections
RUN echo "host    all             all             127.0.0.1/32            trust" >> /var/lib/postgresql/data/pg_hba.conf && \
    echo "host    all             all             ::1/128                 trust" >> /var/lib/postgresql/data/pg_hba.conf && \
    echo "listen_addresses = 'localhost'" >> /var/lib/postgresql/data/postgresql.conf && \
    echo "unix_socket_directories = '/var/run/postgresql'" >> /var/lib/postgresql/data/postgresql.conf

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
        fastcgi_read_timeout 300;\n\
    }\n\
\n\
    location ~ /\.(?!well-known).* {\n\
        deny all;\n\
    }\n\
}' > /etc/nginx/sites-available/default

# PostgreSQL startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "[$(date)] Starting PostgreSQL..."\n\
exec su - postgres -c "/usr/lib/postgresql/15/bin/postgres -D /var/lib/postgresql/data"' > /usr/local/bin/start-postgres.sh && \
chmod +x /usr/local/bin/start-postgres.sh

# Supervisor config - critical ordering
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
logfile=/dev/stdout\n\
logfile_maxbytes=0\n\
loglevel=info\n\
\n\
[program:postgresql]\n\
command=/usr/local/bin/start-postgres.sh\n\
priority=1\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
startsecs=15\n\
stopasgroup=true\n\
\n\
[program:php-fpm]\n\
command=/usr/local/sbin/php-fpm --nodaemonize\n\
priority=2\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
startsecs=5\n\
stopasgroup=true\n\
\n\
[program:nginx]\n\
command=/usr/sbin/nginx -g "daemon off;"\n\
priority=3\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
startsecs=5\n\
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
stderr_logfile_maxbytes=0' > /etc/supervisor/conf.d/supervisord.conf

# Init script with aggressive PostgreSQL checking
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "[$(date)] === Laravel Initialization Starting ==="\n\
\n\
# Give PostgreSQL extra time to start\n\
sleep 20\n\
\n\
# Check if PostgreSQL is responding\n\
echo "[$(date)] Checking PostgreSQL connection..."\n\
for i in {1..60}; do\n\
  if su - postgres -c "/usr/lib/postgresql/15/bin/pg_isready -h localhost" 2>/dev/null | grep -q "accepting connections"; then\n\
    echo "[$(date)] PostgreSQL is accepting connections!"\n\
    break\n\
  fi\n\
  echo "[$(date)] Attempt $i: PostgreSQL not ready yet..."\n\
  sleep 2\n\
done\n\
\n\
sleep 3\n\
\n\
# Create Laravel user and database\n\
echo "[$(date)] Setting up database..."\n\
su - postgres -c "psql -h localhost -U postgres -tc \"SELECT 1 FROM pg_database WHERE datname = '\''laravel'\''\" | grep -q 1 || psql -h localhost -U postgres -c \"CREATE DATABASE laravel;\"" || true\n\
\n\
# Wait for database to be accessible from www-data user\n\
echo "[$(date)] Verifying database access..."\n\
sleep 2\n\
\n\
cd /var/www/html\n\
\n\
# Set environment if not set\n\
if [ -z "$DB_HOST" ]; then\n\
  export DB_HOST=localhost\n\
  export DB_PORT=5432\n\
  export DB_DATABASE=laravel\n\
  export DB_USERNAME=postgres\n\
  export DB_PASSWORD=""\n\
fi\n\
\n\
echo "[$(date)] Running Laravel caching..."\n\
php artisan config:cache 2>&1 || echo "Config cache failed (may retry)"\n\
php artisan route:cache 2>&1 || echo "Route cache failed (may retry)"\n\
php artisan view:cache 2>&1 || echo "View cache failed (may retry)"\n\
\n\
echo "[$(date)] Running migrations..."\n\
php artisan migrate --force --no-interaction 2>&1\n\
\n\
echo "[$(date)] Running seeders..."\n\
php artisan db:seed --force --no-interaction 2>&1 || echo "Seeding skipped or failed"\n\
\n\
echo "[$(date)] === Laravel Initialization Complete ==="\n\
' > /var/www/html/init.sh && \
chmod +x /var/www/html/init.sh

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]