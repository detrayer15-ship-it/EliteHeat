/**
 * Cache Service for EliteHeat
 * In-memory caching with TTL support for AI responses
 */

class CacheService {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 30 * 60 * 1000; // 30 minutes
        this.maxSize = 500; // Maximum cache entries

        // Auto-cleanup every 10 minutes
        this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);

        console.log('[CACHE] Service initialized with TTL:', this.defaultTTL / 1000, 'seconds');
    }

    /**
     * Generate cache key from message
     */
    generateKey(message, mode = 'tutor') {
        const normalized = message.toLowerCase().trim().replace(/\s+/g, ' ');
        return `${mode}:${normalized}`;
    }

    /**
     * Get cached response
     */
    get(message, mode = 'tutor') {
        const key = this.generateKey(message, mode);
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        // Update hit count and last accessed
        entry.hits++;
        entry.lastAccessed = Date.now();

        console.log(`[CACHE] HIT for: "${message.substring(0, 30)}..." (hits: ${entry.hits})`);

        return entry.response;
    }

    /**
     * Store response in cache
     */
    set(message, response, mode = 'tutor', ttl = null) {
        const key = this.generateKey(message, mode);

        // Enforce max size - remove oldest entries if needed
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }

        const entry = {
            response,
            createdAt: Date.now(),
            expiresAt: Date.now() + (ttl || this.defaultTTL),
            lastAccessed: Date.now(),
            hits: 0
        };

        this.cache.set(key, entry);
        console.log(`[CACHE] STORED: "${message.substring(0, 30)}..." (size: ${this.cache.size})`);

        return true;
    }

    /**
     * Check if message should be cached
     * Short messages and greetings shouldn't be cached via Gemini
     */
    shouldCache(message) {
        const minLength = 15; // Min characters to cache
        const normalized = message.toLowerCase().trim();

        // Don't cache very short messages
        if (normalized.length < minLength) {
            return false;
        }

        // Don't cache greetings (they have quick responses)
        const greetings = ['привет', 'здравствуй', 'кто ты', 'как дела', 'хай', 'hello'];
        if (greetings.some(g => normalized.startsWith(g))) {
            return false;
        }

        return true;
    }

    /**
     * Evict oldest/least used entries
     */
    evictOldest() {
        let oldest = null;
        let oldestKey = null;

        for (const [key, entry] of this.cache.entries()) {
            if (!oldest || entry.lastAccessed < oldest.lastAccessed) {
                oldest = entry;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            console.log('[CACHE] Evicted oldest entry');
        }
    }

    /**
     * Clean expired entries
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`[CACHE] Cleanup: removed ${cleaned} expired entries`);
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        let totalHits = 0;
        let oldestEntry = null;

        for (const entry of this.cache.values()) {
            totalHits += entry.hits;
            if (!oldestEntry || entry.createdAt < oldestEntry) {
                oldestEntry = entry.createdAt;
            }
        }

        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            totalHits,
            oldestEntryAge: oldestEntry ? Date.now() - oldestEntry : 0,
            defaultTTL: this.defaultTTL
        };
    }

    /**
     * Clear entire cache
     */
    clear() {
        this.cache.clear();
        console.log('[CACHE] Cleared all entries');
    }

    /**
     * Destroy service
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.clear();
    }
}

export const cacheService = new CacheService();
