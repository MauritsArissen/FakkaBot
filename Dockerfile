# Use Node.js 20 as the base image
FROM node:20-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install build dependencies
RUN apt-get update \
  && apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

# Install dependencies
RUN npm ci
RUN npm run prisma:concat_prd
RUN npm run prisma:generate

# Copy only the built application
COPY dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/bot.js"]