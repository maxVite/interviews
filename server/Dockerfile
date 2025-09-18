FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile

COPY server/ ./server/

FROM base AS build
WORKDIR /app/server

RUN npx prisma generate
RUN pnpm build

FROM node:20-alpine AS production
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY server/package.json ./server/

RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/generated ./server/generated
COPY server/prisma ./server/prisma

EXPOSE 3000

WORKDIR /app/server
CMD ["node", "dist/main.js"]
