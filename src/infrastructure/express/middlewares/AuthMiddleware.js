const VerifyTokenQuery = require('../../../core/services/features/auth/queries/VerifyTokenQuery/VerifyTokenQuery');
const VerifyTokenHandler = require('../../../core/services/features/auth/queries/VerifyTokenQuery/VerifyTokenHandler');

const authMiddleware = (authService, tokenBlacklist) => {
    const verifyTokenHandler = new VerifyTokenHandler(authService);

    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ message: 'Token has been revoked' });
        }

        try {
            const query = new VerifyTokenQuery(token);
            const decodedToken = await verifyTokenHandler.handle(query);
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = { authMiddleware };
