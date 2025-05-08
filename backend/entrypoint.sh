#!/bin/bash
set -e

# Wait for PostgreSQL to be ready (only needed if your DB takes time to start)
# while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
#   sleep 1
# done

# Run migrations
php artisan migrate --force

# Start the application
exec "$@"