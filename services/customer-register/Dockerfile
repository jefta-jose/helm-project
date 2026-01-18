# Stage 1: Builder stage
FROM node:20-alpine AS builder

# Set working directory in the container
WORKDIR /app

# Copy only package files for dependency installation
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Production stage
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create a non-root user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application files (explicitly, not COPY . .)
COPY --chown=nodejs:nodejs index.js ./
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs config ./config
COPY --chown=nodejs:nodejs controller ./controller
COPY --chown=nodejs:nodejs service ./service

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 3011

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "index.js"]