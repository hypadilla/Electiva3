const express = require("express");
const { validateLogin } = require('../middlewares/UserMiddleware');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const AuthController = require("../../../adapters/controllers/AuthController");

const AuthenticateUserHandler = require("../../../core/services/features/auth/commands/AuthenticateUserCommand/AuthenticateUserHandler");
const LogoutUserHandler = require("../../../core/services/features/auth/commands/LogoutUserCommand/LogoutUserHandler");

module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();

    const authenticateUserHandler = new AuthenticateUserHandler(authService);
    const logoutUserHandler = new LogoutUserHandler(tokenBlacklist);

    const authController = new AuthController(authenticateUserHandler, logoutUserHandler);

    router.post('/auth/login', validateLogin, (req, res) => authController.login(req, res));
    router.post('/auth/logout', authMiddleware(authService, tokenBlacklist), (req, res) => authController.logout(req, res));

    return router;
};
