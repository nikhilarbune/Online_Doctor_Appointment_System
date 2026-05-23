#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running Django migrations..."
cd backend
python manage.py migrate --noinput
cd ..

echo "Build completed successfully!"
