# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY src/prisma ./src/prisma/

# Install all dependencies
RUN npm install

# Copy source code first
COPY . .

# Generate Prisma client (after schema is available)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY src/prisma ./src/prisma/

# Install production dependencies only
RUN npm install --omit=dev

# Copy generated Prisma client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built code
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
