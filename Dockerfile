# Stage 1: Build the React client
FROM node:22-alpine AS client-build
WORKDIR /usr/src/app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Node.js server
FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Copy the built client from the previous stage
COPY --from=client-build /usr/src/app/client/dist ./client/dist

EXPOSE 3000
CMD ["npm", "start"]