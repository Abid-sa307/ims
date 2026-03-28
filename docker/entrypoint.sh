#!/bin/sh

# Exit on error
set -e

# Run migrations (force for production)
php artisan migrate --force

# Cache configuration and routes for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions for storage and bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Start Apache in the foreground
exec apache2-foreground
