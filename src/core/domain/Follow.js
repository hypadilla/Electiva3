const BaseDomainModel = require('./common/BaseDomainModel');

class Follow extends BaseDomainModel {
    constructor({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy, follower, following }) {
        super({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy });
        this.follower = follower;
        this.following = following;
    }
}

module.exports = Follow;
