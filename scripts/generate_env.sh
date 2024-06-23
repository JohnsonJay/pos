#!/bin/bash

# Prompt the user for each environment variable
echo "Enter the JWT secret key:"
read -r JWT_SECRET

echo "Enter docker container name for database instance (default: mysql_db):"
read -r CONTAINER_NAME
CONTAINER_NAME=${CONTAINER_NAME:-mysql_db}

echo "Enter the database host (default: db):"
read -r DB_HOST
DB_HOST=${DB_HOST:-db}

echo "Enter the database user (default: root):"
read -r DB_USER
DB_USER=${DB_USER:-root}

echo "Enter the database password (default: password):"
read -r DB_PASSWORD
DB_PASSWORD=${DB_PASSWORD:-password}

echo "Enter the database name (default: pos_system):"
read -r DB_NAME
DB_NAME=${DB_NAME:-pos_system}

echo "Enter the port for the Fastify server (default: 3000):"
read -r PORT
PORT=${PORT:-3000}

# Create the .env file
cat <<EOL > .env
# JWT secret key for authentication
JWT_SECRET=$JWT_SECRET

# Container name for logging
CONTAINER_NAME=$CONTAINER_NAME

# Database configuration
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME

# Port for the Fastify server
PORT=$PORT
EOL

echo ".env file has been created successfully."
