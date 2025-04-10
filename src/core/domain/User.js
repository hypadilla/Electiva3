const BaseDomainModel = require('./common/BaseDomainModel');

class User extends BaseDomainModel {
    constructor
        (
            { id,
                createdDate,
                createdBy,
                lastModifiedDate,
                lastModifiedBy, username,
                email,
                name,
                password
            }) {
        super({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy });
        this.username = username;
        this.email = email;
        this.name = name;
        this.password = password;
    }
}

module.exports = User;
