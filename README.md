# POS System
## Tech Stack
This project was built using:
- NodeJS + TypeScript
- Fastify
- MySQL
- Docker
- NPM

## Getting Started
### Give Scripts Execute Permissions 
**generate_env.sh**
```shell
chmod +x scripts/generate_env.sh
```
**start_docker_mysql.sh**
```shell
chmod +x scripts/start_docker_mysql.sh
```
**stop_docker_mysql.sh**
```shell
chmod +x scripts/stop_docker_mysql.sh
```
**start_server_and_db.sh**
```shell
chmod +x scripts/start_server_and_db.sh
```
## Running Application

Dependencies can be installed by running:
```npm
npm install
```

### Bash Scripts
I've provided a bunch of scripts that are responsible for the scaffolding of the project:
```shell
scripts/generate_env.sh
```
This file generates a `.env` file which is crucial for establishing a DB connection
and generating a JWT token. This file **MUST** be executed before the server can be started. Default values are provided
for each variable, except the `JWT_TOKEN`. 

```shell
scripts/start_docker_mysql.sh
```
This file starts a docker instance of a MySQL Database.

```shell
scripts/start_docker_mysql.sh
```
This file stops and **REMOVES** the MySQL docker instance that was created.

```shell
scripts/start_server_and_db.sh
```
This file is meant to start up a MySQL container in docker.
Once this has been setup and a connection test is successful, the server will be started.

### NPM Scripts (The only ones that we'll need)

The following scripts are basically wrappers for the bash scripts, and will execute those.

This command is **IMPORTANT** and needs to be run before all other commands.
It will generate a `.env` file which is essential for the DB connection and JWT functionality.
```npm 
npm run generate-env
```

This command can be used to start up a MySQL image inside a docker container and run the server using Nodemon.
``` npm 
npm run start-with-db
```

This command can be used to start up a MySQL image inside a docker container - allowing you to run the server separately
```npm 
npm run start-db-instance
```

This command is used to stop and remove the MySQL image.
```npm
npm run stop-db-instance
```
