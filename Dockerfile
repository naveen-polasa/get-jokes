# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files to container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the app
#RUN npm run build

# Serve the app with a static file server
RUN npm install -g serve

# Set the command to start the static file server
CMD ["serve", "-s", "build"]

# Expose the port the app is listening on
EXPOSE 5000
