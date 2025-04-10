const TweetMapper = require('../../../../mapping/TweetMapper');

class CreateTweetHandler {
    constructor(tweetRepository) {
        this.tweetRepository = tweetRepository;
    }

    async handle(command) {
        const createdTweet = await this.tweetRepository.createTweet(command.tweetData);
        return TweetMapper.toClient(createdTweet);
    }
}

module.exports = CreateTweetHandler;
