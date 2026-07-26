FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY src/prisma ./src/prisma/
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npx tsc --project tsconfig.json

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY src/prisma ./src/prisma/

RUN mkdir -p logs

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/server.js"]

