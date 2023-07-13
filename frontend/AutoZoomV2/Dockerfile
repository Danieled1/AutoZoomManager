# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14-alpine

# Create and change to the app directory.
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Switch to 'node' user
USER node

# Copy package.json and package-lock.json (if available)
COPY --chown=node:node package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
RUN npm install 

# Copy local code to the container image.
COPY --chown=node:node . .

# Give execution permissions to the node_modules/.bin folder
RUN chmod -R 755 node_modules/.bin

# Expose the application on port 8000
EXPOSE 8000

# Run the web service on container startup.
CMD ["npm", "run", "dev"]

