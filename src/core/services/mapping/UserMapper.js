const User = require('../../domain/User');

class UserMapper {
    static toDomain(userDocument) {
        return new User({
            id: userDocument._id,
            createdDate: userDocument.createdDate,
            createdBy: userDocument.createdBy,
            lastModifiedDate: userDocument.lastModifiedDate,
            lastModifiedBy: userDocument.lastModifiedBy,
            username: userDocument.username,
            email: userDocument.email,
            password: userDocument.password,
            name: userDocument.name
        });
    }

    static toPersistence(user) {
        return {
            _id: user.id,
            createdDate: user.createdDate,
            createdBy: user.createdBy,
            lastModifiedDate: user.lastModifiedDate,
            lastModifiedBy: user.lastModifiedBy,
            username: user.username,
            email: user.email,
            password: user.password,
            name: user.name
        };
    }

    static toClient(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            createdDate: user.createdDate
        };
    }
}

module.exports = UserMapper;