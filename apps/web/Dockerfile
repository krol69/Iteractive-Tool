FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* .npmrc* ./ 2>/dev/null || true
RUN npm i -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
RUN pnpm add -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
