class CreateUserCommand {
    constructor(username, password, email, name) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
    }
}

module.exports = CreateUserCommand;
