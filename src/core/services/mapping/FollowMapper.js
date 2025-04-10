const Follow = require('../../domain/Follow');

class FollowMapper {
    static toDomain(followDocument) {
        return new Follow({
            id: followDocument._id,
            createdDate: followDocument.createdDate,
            createdBy: followDocument.follower,
            lastModifiedDate: followDocument.lastModifiedDate,
            lastModifiedBy: followDocument.follower,
            follower: followDocument.follower,
            following: followDocument.following,
        });
    }

    static toPersistence(follow) {
        return {
            follower: follow.follower,
            following: follow.following,
        };
    }

    static toClient(follow) {
        return {
            id: follow.id,
            follower: follow.follower,
            following: follow.following,
            createdDate: follow.createdDate,
        };
    }
}

module.exports = FollowMapper;
