#!/bin/sh

# Exit on error
set -e

# Debugging: Show available PHP modules
echo "Checking PHP modules..."
php -m

# Validate APP_KEY
if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY is not set. Please set it in your environment variables."
    exit 1
fi

# Ensure configuration is cleared to avoid stale driver references
# Use SESSION_DRIVER=file and CACHE_STORE=array to avoid DB connection errors during the initial boot
# especially before migrations have run.
echo "Clearing Laravel configuration cache..."
SESSION_DRIVER=file CACHE_STORE=array php artisan config:clear || { echo "ERROR: failed to clear config cache. Check your configuration files for syntax errors."; exit 1; }
SESSION_DRIVER=file CACHE_STORE=array php artisan cache:clear || { echo "ERROR: failed to clear cache. Check your configuration files for syntax errors."; exit 1; }

# Run migrations (force for production)
echo "Running database migrations..."
php artisan migrate --force

# Cache configuration and routes for performance
echo "Caching configuration and routes..."
php artisan config:cache || { echo "ERROR: Migration succeeded but config caching failed."; exit 1; }
php artisan route:cache || { echo "ERROR: Route caching failed. Check your routes for issues."; exit 1; }
php artisan view:cache || { echo "ERROR: View caching failed."; exit 1; }

# Ensure structure exists and set permissions for storage and bootstrap/cache
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Start Apache in the foreground
exec apache2-foreground
