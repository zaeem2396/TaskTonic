# Use the official Node.js 20 image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY . .

# Install app dependencies
RUN npm install

RUN ./node_modules/.bin/tsc

# Expose the port your app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
