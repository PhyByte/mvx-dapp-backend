# Use a node base image
FROM node:20-slim as build

# Update apt-get and install necessary tools including OpenSSL
RUN apt-get update && apt-get install -y openssl

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including Prisma CLI
RUN npm ci --verbose

# Install TypeScript globally
RUN npm install -g typescript

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Install only production dependencies
RUN npm prune --production

# Runtime stage
FROM node:20-slim

# Set the working directory in the runtime container
WORKDIR /app

# Install OpenSSL in runtime
RUN apt-get update && apt-get install -y openssl

# Copy build files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Expose port 3000 for the app
EXPOSE 3000

# Run migrations and then start the application
CMD npx prisma migrate deploy && node dist/main.js