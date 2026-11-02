# Angular SSR. Работает после создания приложения в frontend/ (ng new --ssr).
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=4000
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 4000
# Имя папки в dist совпадает с именем проекта Angular
CMD ["sh", "-c", "node dist/*/server/server.mjs"]
