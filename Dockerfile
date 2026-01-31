# Dockerfile for EliteHeat
# Multi-stage build for optimized production image

# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# ============================================
# Stage 2: Build Backend
# ============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src

# ============================================
# Stage 3: Production Image
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install serve for static files
RUN npm install -g serve

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S eliteheat -u 1001

# Copy built frontend
COPY --from=frontend-builder /app/dist ./frontend/dist

# Copy backend
COPY --from=backend-builder /app/backend ./backend

# Create logs directory
RUN mkdir -p /app/backend/logs && \
    chown -R eliteheat:nodejs /app

# Switch to non-root user
USER eliteheat

# Expose ports
EXPOSE 3000 5173

# Default environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    FRONTEND_PORT=5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start script (will be overridden by docker-compose)
CMD ["sh", "-c", "cd backend && node src/server.js"]
