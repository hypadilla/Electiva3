const TweetMapper = require('../../../../mapping/TweetMapper');

class UpdateTweetHandler {
    constructor(tweetRepository) {
        this.tweetRepository = tweetRepository;
    }

    async handle(command) {
        const updatedTweet = await this.tweetRepository.updateTweet(command.tweetId, command.message);
        return updatedTweet ? TweetMapper.toClient(updatedTweet) : null;
    }
}

module.exports = UpdateTweetHandler;
