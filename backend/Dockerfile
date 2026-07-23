FROM node:20

# Install compilers and runtimes (g++, python3, default-jdk)
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

EXPOSE 10000

CMD ["npm", "start"]