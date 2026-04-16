# Stage 1: Build Assets
FROM php:8.4-cli AS build

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Use official PHP extension installer for robust extension management
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    zip unzip git curl gnupg procps \
    && install-php-extensions gd pdo_mysql pdo_pgsql pgsql bcmath intl zip mbstring xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# 1. Install PHP dependencies first
RUN composer install --no-dev --optimize-autoloader

# Debugging: show loaded modules in build stage
RUN php -m

# 2. Build assets with dummy env to prevent DB connection errors
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=:memory:
ENV APP_KEY=base64:Zi682yEnRfxnCo4oj2i33AQAu66bYMTHcgd0Dqtd7RY=
ENV SKIP_WAYFINDER=true
RUN npm install && npm run build

# Stage 2: Production Server
FROM php:8.4-apache

# Set environment for Render port
ENV PORT=10000

# Use official PHP extension installer
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    zip unzip git curl gnupg procps \
    && install-php-extensions gd pdo_mysql pdo_pgsql pgsql bcmath intl zip opcache mbstring xml

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy everything from the build stage
COPY --from=build /app /var/www/html

# Robust Apache Configuration for Render
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i "s/80/\${PORT}/g" /etc/apache2/sites-available/000-default.conf \
    && echo "Listen \${PORT}" > /etc/apache2/ports.conf \
    && echo 'SetEnvIf X-Forwarded-Proto "https" HTTPS=on' >> /etc/apache2/apache2.conf \
    && printf '\n<Directory /var/www/html/public>\n    Options Indexes FollowSymLinks\n    AllowOverride All\n    Require all granted\n</Directory>\n' >> /etc/apache2/apache2.conf

# Set permissions for the entire web directory
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Debugging: show loaded modules in final image
RUN php -m

# Copy and prepare entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
