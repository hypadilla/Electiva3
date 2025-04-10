const BaseDomainModel = require('./common/BaseDomainModel');

class Tweet extends BaseDomainModel {
    constructor({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy, message }) {
        super({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy });
        this.message = message;
    }
}

module.exports = Tweet;
