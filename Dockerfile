# Install dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build the app
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app ./
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
CMD ["node", "dist/main.js"]
