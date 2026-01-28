# =============================================================================
# PDFCraft Production Dockerfile
# Multi-stage build for optimized image size
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build the Next.js static export
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the static export
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Serve with Nginx
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS production

# Add labels for GitHub Container Registry
LABEL org.opencontainers.image.source="https://github.com/PDFCraftTool/pdfcraft"
LABEL org.opencontainers.image.description="PDFCraft - Professional PDF Tools, Free, Private & Browser-Based"
LABEL org.opencontainers.image.licenses="AGPL-3.0"
LABEL org.opencontainers.image.title="PDFCraft"
LABEL org.opencontainers.image.vendor="PDFCraftTool"

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static export from builder stage
COPY --from=builder /app/out /website/pdfcraft

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/en/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
