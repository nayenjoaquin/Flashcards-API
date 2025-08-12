# Stage 1 — Build the app
FROM node:20-alpine AS build

# Create and set working directory
WORKDIR /usr/src/app

# Copy package files and install ALL deps (including dev)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Compile TypeScript -> dist
RUN npm run build

# Stage 2 — Production image
FROM node:20-alpine AS prod
WORKDIR /usr/src/app

# Copy only package files, install production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output from build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose app port
EXPOSE 5050

# Start the app
CMD ["node", "dist/index.js"]
