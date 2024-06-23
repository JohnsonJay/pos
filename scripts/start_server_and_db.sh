#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start MySQL container
./scripts/start_docker_mysql.sh

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until docker exec ${CONTAINER_NAME} mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "SHOW DATABASES;" &> /dev/null
do
    printf "."
    sleep 2
done
echo "MySQL is ready."

# Start the Fastify server
echo "Starting Fastify server..."
npm run dev
