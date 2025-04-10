const UserMapper = require('../../../../mapping/UserMapper');

class GetAuthenticatedUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(query) {
        const user = await this.userRepository.getById(query.userId);
        return user ? UserMapper.toClient(user) : null;
    }
}

module.exports = GetAuthenticatedUserHandler;
