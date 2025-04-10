class GetFollowingQuery {
    constructor(myUserId, username, page, limit) {
        this.myUserId = myUserId;
        this.username = username;
        this.page = page;
        this.limit = limit;
    }
}

module.exports = GetFollowingQuery;