FROM node:20-alpine AS base
WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc* ./ 2>/dev/null || true
COPY ../../packages ./packages
COPY ./ .

RUN npm i -g pnpm && pnpm install --shamefully-hoist

RUN pnpm prisma generate && pnpm build

EXPOSE 4000
CMD [ "pnpm", "start" ]
