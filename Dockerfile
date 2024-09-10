FROM node:20.3.1-slim as base

FROM base as builder

WORKDIR /builder
COPY . .

# Note: -f is required due to peer dep mismatch
RUN npm ci -f && \
    npm run build && \
    rm -rf node_modules

##################################################

FROM base as runner

WORKDIR /app
RUN mkdir .next

COPY --from=builder /builder/.next/standalone ./
COPY --from=builder /builder/.next/static ./.next/static
# COPY --from=builder /builder/public ./public

RUN chown -R node:node /app
USER node

ENV NODE_ENV production
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
