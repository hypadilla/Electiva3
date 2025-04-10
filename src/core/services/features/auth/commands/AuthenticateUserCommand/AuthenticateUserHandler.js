const UserMapper = require('../../../../mapping/UserMapper');

class AuthenticateUserHandler {
    constructor(authService) {
        this.authService = authService;
    }

    async handle(command) {
        const { user, token } = await this.authService.authenticate({
            username: command.username,
            password: command.password
        });

        const userClient = UserMapper.toClient(user);
        return { userClient, token };
    }
}

module.exports = AuthenticateUserHandler;