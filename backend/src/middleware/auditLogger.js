/**
 * Audit Logger Middleware for EliteHeat
 * Logs all administrative actions for security and compliance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Audit log storage
 */
class AuditLogger {
    constructor() {
        this.logs = [];
        this.maxInMemoryLogs = 1000;
        this.logFile = path.join(__dirname, '../../logs/audit.log');

        // Ensure logs directory exists
        const logsDir = path.dirname(this.logFile);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        console.log('[AUDIT] Logger initialized');
    }

    /**
     * Log an action
     */
    log(action, data = {}) {
        const entry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            action,
            ...data
        };

        // Store in memory
        this.logs.push(entry);

        // Trim if too many logs
        if (this.logs.length > this.maxInMemoryLogs) {
            const toWrite = this.logs.splice(0, 500);
            this.writeToFile(toWrite);
        }

        // Also write immediately for important actions
        if (this.isImportantAction(action)) {
            this.writeToFile([entry]);
        }

        console.log(`[AUDIT] ${action}: ${JSON.stringify(data).substring(0, 100)}`);

        return entry;
    }

    /**
     * Check if action is important enough for immediate file write
     */
    isImportantAction(action) {
        const importantActions = [
            'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
            'USER_CREATE', 'USER_DELETE', 'USER_UPDATE',
            'PERMISSION_CHANGE', 'CONFIG_CHANGE',
            'DATA_EXPORT', 'DATA_DELETE'
        ];
        return importantActions.includes(action);
    }

    /**
     * Generate unique log ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Write logs to file
     */
    writeToFile(entries) {
        try {
            const lines = entries.map(e => JSON.stringify(e)).join('\n') + '\n';
            fs.appendFileSync(this.logFile, lines, 'utf8');
        } catch (error) {
            console.error('[AUDIT] Failed to write to file:', error.message);
        }
    }

    /**
     * Get recent logs
     */
    getRecentLogs(count = 50) {
        return this.logs.slice(-count).reverse();
    }

    /**
     * Search logs by criteria
     */
    searchLogs({ action, userId, ip, startDate, endDate }) {
        return this.logs.filter(log => {
            if (action && log.action !== action) return false;
            if (userId && log.userId !== userId) return false;
            if (ip && log.ip !== ip) return false;
            if (startDate && new Date(log.timestamp) < new Date(startDate)) return false;
            if (endDate && new Date(log.timestamp) > new Date(endDate)) return false;
            return true;
        });
    }

    /**
     * Export logs
     */
    exportLogs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.logs, null, 2);
        }

        // CSV format
        if (this.logs.length === 0) return '';

        const headers = Object.keys(this.logs[0]).join(',');
        const rows = this.logs.map(log =>
            Object.values(log).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
        );

        return [headers, ...rows].join('\n');
    }
}

// Singleton instance
export const auditLogger = new AuditLogger();

/**
 * Extract client IP from request
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'unknown';
}

/**
 * Audit middleware for admin routes
 */
export const auditMiddleware = (req, res, next) => {
    const startTime = Date.now();

    // Store original end function
    const originalEnd = res.end;

    // Override end to capture response
    res.end = function (...args) {
        const duration = Date.now() - startTime;

        // Only log admin and important actions
        const shouldLog =
            req.path.includes('/admin') ||
            req.path.includes('/auth') ||
            req.method !== 'GET';

        if (shouldLog) {
            auditLogger.log('API_REQUEST', {
                method: req.method,
                path: req.path,
                ip: getClientIP(req),
                userId: req.user?.id || req.body?.userId || 'anonymous',
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                userAgent: req.headers['user-agent']?.substring(0, 100)
            });
        }

        // Call original end
        originalEnd.apply(this, args);
    };

    next();
};

/**
 * Log specific admin action
 */
export const logAdminAction = (action, req, details = {}) => {
    return auditLogger.log(action, {
        ip: getClientIP(req),
        userId: req.user?.id || req.body?.userId || 'anonymous',
        userAgent: req.headers['user-agent']?.substring(0, 100),
        ...details
    });
};

/**
 * Endpoint to get audit logs (admin only)
 */
export const getAuditLogs = (req, res) => {
    try {
        const { count = 50, action, userId, startDate, endDate, format = 'json' } = req.query;

        let logs;

        if (action || userId || startDate || endDate) {
            logs = auditLogger.searchLogs({ action, userId, startDate, endDate });
        } else {
            logs = auditLogger.getRecentLogs(parseInt(count));
        }

        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=audit_logs.csv');
            return res.send(auditLogger.exportLogs('csv'));
        }

        res.json({
            success: true,
            count: logs.length,
            logs
        });
    } catch (error) {
        console.error('[AUDIT] Get logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve audit logs'
        });
    }
};

export default auditMiddleware;
