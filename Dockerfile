# Use official Node.js 22 image as the base
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package files and install dependencies
COPY package-lock.json ./
COPY package.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the project
RUN npm run build

# Production stage: use a lightweight web server for the final image
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy only the built files and necessary assets from the build stage
COPY --from=build /app/dist/zoneless-calculator /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port the app runs on
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]
