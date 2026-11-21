FROM node:22-slim AS runner

# Install openssl for Prisma engines
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Copy package and prisma definition
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including production & prisma client)
RUN npm install --omit=dev && npm install prisma@6.4.1 tsx

# Copy built app and entrypoint
COPY .next ./.next
COPY public ./public
COPY docker-entrypoint.sh ./

# Generate Prisma Client in container
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]

