# Stage 1: Build Assets
FROM php:8.3-cli AS build

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install system dependencies for PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev libicu-dev \
    libonig-dev libxml2-dev libpq-dev zip unzip git curl gnupg procps

# Install PHP extensions required by Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql pdo_pgsql pgsql bcmath intl zip mbstring xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# 1. Install PHP dependencies first (needed for Vite plugins that call Artisan)
RUN composer install --no-dev --optimize-autoloader

# 2. Build assets with dummy env to prevent DB connection errors
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=:memory:
ENV APP_KEY=base64:Zi682yEnRfxnCo4oj2i33AQAu66bYMTHcgd0Dqtd7RY=
RUN npm install && npm run build

# Stage 2: Production Server
FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev libicu-dev \
    libonig-dev libxml2-dev libpq-dev zip unzip git curl gnupg procps

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql pdo_pgsql pgsql bcmath intl zip opcache mbstring xml

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy everything from the build stage (including vendor and built assets)
COPY --from=build /app /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache for Render
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && echo "Listen \${PORT}" > /etc/apache2/ports.conf \
    && sed -i "s/80/\${PORT}/g" /etc/apache2/sites-available/000-default.conf

# Set environment for Render port
ENV PORT=10000

# Copy and prepare entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
