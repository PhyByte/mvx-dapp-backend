# MVX Dapp Template - Backend

## Overview

Brief description of your project, its purpose, and any unique features or goals.

## Technologies

- **Nest.js**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.
- **Docker**: A tool designed to make it easier to create, deploy, and run applications by using containers.

## Project Structure

This structure includes:

- `Dockerfile`: Configuration for Docker container.
- `prisma/`: Contains Prisma ORM configuration and migration files.
- `src/`: Source code directory with modules like `admin`, `auth`, `common`, `guards`, `mvx`, `oracle`, `prisma`, and `wallet`.
- `test/`: Contains end-to-end tests.

## Installation and Setup

Explain how to clone, install dependencies, and set up the project.

npm install

## Scripts and Usage

- `build`: Compiles the application.
- `format`: Formats the code using Prettier.
- `prisma:seed`: Seed the database using Prisma.
- `start`: Starts the application.
- `start:dev`: Starts the application in development mode with hot reload.
- `start:debug`: Starts the application in debug mode.
- `start:prod`: Starts the application in production mode.
- `lint`: Lints and fixes files.
- `test`: Runs unit tests.
- `prisma:generate`: Generates Prisma client.
- `prisma:migrate`: Migrates the database using Prisma.
- `prisma:reset`: Resets the database using Prisma.
- `prisma:studio`: Opens Prisma Studio.
- `prisma:all`: Runs all Prisma related scripts.

## Docker Integration

Explain how to build and run the application using Docker.

docker build -t [project-name] .
docker run -p 3000:3000 [project-name]
