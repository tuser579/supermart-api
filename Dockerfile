FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy pre-built dist (compiled TypeScript)
COPY dist ./dist

# Copy Prisma schema and generate client
COPY src/prisma ./src/prisma/
RUN npx prisma generate

# Create logs directory
RUN mkdir -p logs

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/server.js"]
