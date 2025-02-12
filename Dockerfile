# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite project (if needed for production)
RUN npm run build

# Expose the port the app runs on (adjust if your server uses a different port)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]