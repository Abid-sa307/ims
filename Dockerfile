FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    git \
    curl \
    gnupg

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql bcmath intl zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Install dependencies and build assets
RUN composer install --no-dev --optimize-autoloader \
    && npm install \
    && npm run build

# Configure Apache
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && echo "Listen \${PORT}" > /etc/apache2/ports.conf \
    && sed -i "s/80/\${PORT}/g" /etc/apache2/sites-available/000-default.conf

# Set environment for Render port
ENV PORT=80

# Start command
CMD ["apache2-foreground"]
