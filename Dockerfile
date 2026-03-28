# Base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (your Express server runs on 5173)
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev", "--", "--host"]
