# Example: Using CMD only
# The command can be easily overridden

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# CMD defines the default command to run
CMD ["node", "server.js"]

# Usage:
# docker run myapp                    → runs: node server.js
# docker run myapp node worker.js     → runs: node worker.js (replaced!)
# docker run myapp echo "Hello"       → runs: echo "Hello" (replaced!)
