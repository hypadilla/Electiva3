const express = require("express");
const { validateRegister } = require('../middlewares/UserMiddleware');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const UserController = require("../../../adapters/controllers/UserController");
const UserRepository = require("../../../infrastructure/repositories/UserRepository");

const CreateUserHandler = require("../../../core/services/features/user/commands/CreateUserCommand/CreateUserHandler");
const GetAuthenticatedUserHandler = require("../../../core/services/features/user/queries/GetAuthenticatedUserQuery/GetAuthenticatedUserHandler");

module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();

    const userRepository = new UserRepository();

    const createUserHandler = new CreateUserHandler(userRepository);
    const getAuthenticatedUserHandler = new GetAuthenticatedUserHandler(userRepository);

    const userController = new UserController(
        createUserHandler,
        getAuthenticatedUserHandler
    );

    router.post('/auth/register', validateRegister, (req, res) => userController.registerUser(req, res));
    router.get('/me', authMiddleware(authService, tokenBlacklist), (req, res) => userController.getAuthenticatedUser(req, res));

    return router;
};
