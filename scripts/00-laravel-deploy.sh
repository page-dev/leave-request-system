#!/usr/bin/env bash

set -e

echo "Caching Laravel configuration..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

echo "Running database migrations..."
php artisan migrate --force

echo "Laravel deployment complete."