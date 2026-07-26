FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy Prisma schema and generate client
COPY src/prisma ./src/prisma/
RUN npx prisma generate

# Copy pre-built dist (already compiled locally, committed to git)
COPY dist ./dist

# Create logs directory
RUN mkdir -p logs

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/server.js"]
