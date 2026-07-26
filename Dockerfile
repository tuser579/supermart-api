FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Generate Prisma client
COPY src/prisma ./src/prisma/
RUN npx prisma generate

# Copy all source and compile TypeScript
COPY tsconfig.json ./
COPY server.ts ./
COPY src ./src
RUN npx tsc --project tsconfig.json

# Verify build output exists
RUN ls -la dist/ && echo "✅ Build successful"

# Create logs directory
RUN mkdir -p logs

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/server.js"]
