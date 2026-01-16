FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]
