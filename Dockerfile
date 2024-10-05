# Build stage
FROM node:lts-alpine AS build
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Install dependencies
RUN pnpm install
# Build the application
COPY . .
RUN pnpm build

FROM node:lts-alpine AS prod-deps 
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Prisma stage
FROM node:lts-alpine AS prisma
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod
# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Production stage
FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "dist/app.js"]
