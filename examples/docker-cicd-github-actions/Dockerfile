# Multi-stage build for optimal image size

# Stage 1: Build dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Stage 2: Production image
FROM node:18-alpine

# Add metadata
LABEL org.opencontainers.image.source="https://github.com/YOURUSERNAME/github-actions-demo"
LABEL org.opencontainers.image.description="GitHub Actions Docker CI/CD Demo"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY package.json ./
COPY src ./src

# Build arguments (set by GitHub Actions)
ARG APP_VERSION=dev
ARG GITHUB_SHA=local

# Set environment variables
ENV NODE_ENV=production \
    APP_VERSION=${APP_VERSION} \
    GITHUB_SHA=${GITHUB_SHA}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expose port
EXPOSE 3000

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Start application
CMD ["npm", "start"]
