class UpdateTweetCommand {
    constructor(tweetId, message) {
        this.tweetId = tweetId;
        this.message = message;
    }
}

module.exports = UpdateTweetCommand;
