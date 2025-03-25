# backend/Dockerfile

# Стадия для разработки и миграций
FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci --include=dev

COPY . .

# Стадия сборки
FROM development AS builder

RUN npm run build

# Стадия для миграций
FROM development AS migration

RUN npm run build

# Стадия production
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

EXPOSE 3001
CMD ["npm", "run", "start:prod"]