# Use an official Node.js image as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Phaser game (assuming your build script is defined in package.json)
RUN npm run build

# Expose the port that the web server will run on
EXPOSE 8080

# Define the command to run your web server
# CMD ["npm", "start"]
CMD ["sleep", "infinity"]