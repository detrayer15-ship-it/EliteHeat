export const trackIP = (req, res, next) => {
    // Get IP address
    const ip = req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'Unknown'

    // Attach to request
    req.clientIP = ip
    req.clientUserAgent = userAgent

    next()
}
