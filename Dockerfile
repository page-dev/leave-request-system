FROM richarvey/nginx-php-fpm:3.1.6

# Install Node.js and npm for Vite/React build
RUN apk add --no-cache nodejs npm

# Copy Laravel application
COPY . .

# Image configuration
ENV WEBROOT=/var/www/html/public
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1
ENV SKIP_COMPOSER=1

# Laravel production configuration
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# Composer runs as root during image build
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install production PHP dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --working-dir=/var/www/html

# Install frontend dependencies and build Vite assets
RUN npm ci && npm run build

# Laravel needs these directories writable
RUN chmod -R ug+rwx /var/www/html/storage \
    /var/www/html/bootstrap/cache

CMD ["/start.sh"]