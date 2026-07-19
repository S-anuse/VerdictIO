FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

# Build the C++ runner image
RUN docker build -t cpp-runner -f Dockerfile.cpp-runner .

EXPOSE 10000

CMD ["npm", "start"]