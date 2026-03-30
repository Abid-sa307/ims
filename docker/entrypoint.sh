#!/bin/sh

# Exit on error
set -e

# Debugging: Show available PHP modules
echo "Checking PHP modules..."
php -m

# Ensure configuration is cleared to avoid stale driver references
echo "Clearing Laravel configuration cache..."
php artisan config:clear
php artisan cache:clear

# Run migrations (force for production)
echo "Running database migrations..."
php artisan migrate --force

# Cache configuration and routes for performance
echo "Caching configuration and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions for storage and bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Start Apache in the foreground
exec apache2-foreground
