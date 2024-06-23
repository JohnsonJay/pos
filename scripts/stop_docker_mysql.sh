#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Variables
CONTAINER_NAME="mysql_db"

# Check if container is running
if [ $(docker ps -q -f name=${CONTAINER_NAME}) ]; then
    echo "Stopping the MySQL container..."
    docker stop ${CONTAINER_NAME}

    echo "Removing the MySQL container..."
    docker rm ${CONTAINER_NAME}

    echo "MySQL container stopped and removed successfully."
else
    echo "No running container with the name ${CONTAINER_NAME} found."
fi
