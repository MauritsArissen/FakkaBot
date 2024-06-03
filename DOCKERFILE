# Use Node.js 20 as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production
RUN npm run primsa:concat_prd
RUN npm run prisma:generate

# Copy only the built application
COPY dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/bot.js"]