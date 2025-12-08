export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: 'Доступ запрещён. Требуются права администратора'
        })
    }
}
