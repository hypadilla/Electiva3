const bcrypt = require('bcrypt');
const UserMapper = require('../../../../mapping/UserMapper');

class CreateUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(command) {
        const hashedPassword = await bcrypt.hash(command.password, 10);
        const userData = {
            username: command.username,
            password: hashedPassword,
            email: command.email,
            name: command.name,
        };
        const user = await this.userRepository.create(userData);
        return UserMapper.toClient(user);
    }
}

module.exports = CreateUserHandler;
