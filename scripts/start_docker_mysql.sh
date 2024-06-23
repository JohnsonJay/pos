#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Variables
CONTAINER_NAME=$CONTAINER_NAME
MYSQL_ROOT_PASSWORD=$DB_PASSWORD
MYSQL_DATABASE=$DB_NAME
MYSQL_USER=$DB_USER
MYSQL_PASSWORD=$DB_PASSWORD
MYSQL_PORT="3306"

# Pull MySQL image
echo "Pulling MySQL image from Docker Hub..."
docker pull mysql:latest

# Check if container already exists
if [ $(docker ps -a -q -f name=${CONTAINER_NAME}) ]; then
    echo "Container with the name ${CONTAINER_NAME} already exists. Removing it..."
    docker rm -f ${CONTAINER_NAME}
fi

# Run MySQL container
echo "Starting MySQL container..."
docker run -d \
    --name ${CONTAINER_NAME} \
    -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
    -e MYSQL_DATABASE=${MYSQL_DATABASE} \
    -e MYSQL_PASSWORD=${MYSQL_PASSWORD} \
    -p ${MYSQL_PORT}:3306 \
    mysql:latest

# Check if the container is running
if [ $(docker ps -q -f name=${CONTAINER_NAME}) ]; then
    echo "MySQL container started successfully."
    echo "Container Name: ${CONTAINER_NAME}"
    echo "MySQL Root Password: ${MYSQL_ROOT_PASSWORD}"
    echo "MySQL Database: ${MYSQL_DATABASE}"
    echo "MySQL User: ${MYSQL_USER}"
    echo "MySQL Password: ${MYSQL_PASSWORD}"
    echo "MySQL Port: ${MYSQL_PORT}"
else
    echo "Failed to start MySQL container."
    exit 1
fi
