# ─── Stage 1: Build de Angular ─────────────────────────────
FROM node:22-alpine AS build
ARG BUILD_CONFIGURATION=production
WORKDIR /app

# Cache de dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build -- --configuration=$BUILD_CONFIGURATION

# ─── Stage 2: Nginx sirviendo estáticos ────────────────────
FROM nginx:1.27-alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/aurora-coinly-web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
