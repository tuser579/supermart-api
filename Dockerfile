FROM node:20-alpine

# Cache buster to force Railway to do a clean build
ARG CACHE_BUSTER=2026-07-26T15:40:00

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY src/prisma ./src/prisma/
RUN npx prisma generate

COPY tsconfig.json ./
COPY server.ts ./
COPY src ./src

RUN npx tsc --project tsconfig.json

RUN ls -la dist/server.js && echo "BUILD OK"

RUN mkdir -p logs

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/server.js"]
