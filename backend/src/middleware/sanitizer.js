/**
 * Input Sanitizer Middleware for EliteHeat
 * Protects against XSS, injection attacks, and malicious input
 */

/**
 * Dangerous patterns to detect and neutralize
 */
const DANGEROUS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,          // Script tags
    /<\s*script/gi,                                    // Opening script
    /javascript\s*:/gi,                                // javascript: protocol
    /on\w+\s*=/gi,                                     // Event handlers (onclick, onerror, etc.)
    /<\s*iframe/gi,                                    // Iframes
    /<\s*object/gi,                                    // Object tags
    /<\s*embed/gi,                                     // Embed tags
    /<\s*link/gi,                                      // Link tags (can load external CSS)
    /expression\s*\(/gi,                               // CSS expressions
    /url\s*\(\s*['"]?\s*data:/gi,                     // Data URLs in CSS
];

/**
 * SQL/NoSQL injection patterns
 */
const INJECTION_PATTERNS = [
    /(\$where|\$gt|\$lt|\$ne|\$regex|\$or|\$and)/gi,  // MongoDB operators
    /(union\s+select|select\s+\*|drop\s+table)/gi,    // SQL injection
    /('\s*or\s*'1'\s*=\s*'1)/gi,                      // Classic SQL injection
    /(--\s*$)/gm,                                      // SQL comment
];

/**
 * Sanitize a single string value
 */
function sanitizeString(value) {
    if (typeof value !== 'string') {
        return value;
    }

    let sanitized = value;

    // Remove dangerous HTML/JS patterns
    for (const pattern of DANGEROUS_PATTERNS) {
        sanitized = sanitized.replace(pattern, '[BLOCKED]');
    }

    // Check for injection patterns (log but don't always block - could be legitimate code questions)
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(value)) {
            console.warn(`[SANITIZER] Potential injection detected: ${value.substring(0, 50)}...`);
        }
    }

    // Encode HTML entities for basic XSS protection
    sanitized = sanitized
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

    return sanitized;
}

/**
 * Sanitize value for AI messages (less strict - allow code examples)
 */
function sanitizeForAI(value) {
    if (typeof value !== 'string') {
        return value;
    }

    let sanitized = value;

    // Only block actual executable script injection, not code examples
    sanitized = sanitized.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '[CODE_BLOCKED]');
    sanitized = sanitized.replace(/javascript\s*:/gi, 'javascript-blocked:');

    return sanitized;
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj, forAI = false) {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'string') {
        return forAI ? sanitizeForAI(obj) : sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, forAI));
    }

    if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            // Sanitize keys too
            const safeKey = sanitizeString(key);
            sanitized[safeKey] = sanitizeObject(value, forAI);
        }
        return sanitized;
    }

    return obj;
}

/**
 * Main sanitizer middleware
 */
export const sanitizer = (req, res, next) => {
    try {
        // Determine if this is an AI endpoint (needs less strict sanitization)
        const isAIEndpoint = req.path.includes('/ai/') || req.path.includes('/chat');

        // Sanitize body
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body, isAIEndpoint);
        }

        // Sanitize query parameters
        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeObject(req.query, false);
        }

        // Sanitize URL parameters
        if (req.params && typeof req.params === 'object') {
            req.params = sanitizeObject(req.params, false);
        }

        next();
    } catch (error) {
        console.error('[SANITIZER] Error:', error);
        next(); // Continue even if sanitization fails
    }
};

/**
 * Strict sanitizer for admin endpoints
 */
export const strictSanitizer = (req, res, next) => {
    try {
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body, false);
        }

        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeObject(req.query, false);
        }

        next();
    } catch (error) {
        console.error('[SANITIZER] Strict sanitization error:', error);
        res.status(400).json({
            success: false,
            message: 'Invalid input data'
        });
    }
};

export default sanitizer;
