# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vite inlines VITE_* variables at BUILD time, so they are passed as build args.
ARG VITE_STOCK_API_KEY=""
ARG VITE_USE_MOCK="false"
ARG VITE_POLL_INTERVAL_MS="10000"
ENV VITE_STOCK_API_KEY=$VITE_STOCK_API_KEY \
    VITE_USE_MOCK=$VITE_USE_MOCK \
    VITE_POLL_INTERVAL_MS=$VITE_POLL_INTERVAL_MS
RUN npm run build

# Stage 2: serve
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
