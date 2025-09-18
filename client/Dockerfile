FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY client/package.json ./client/

RUN pnpm install --frozen-lockfile

COPY client/ ./client/

FROM base AS build
WORKDIR /app/client
RUN pnpm build

FROM nginx:alpine AS production

COPY --from=build /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
