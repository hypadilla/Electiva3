const TweetMapper = require('../../../../mapping/TweetMapper');

class GetTweetByIdHandler {
    constructor(tweetRepository) {
        this.tweetRepository = tweetRepository;
    }

    async handle(query) {
        const tweet = await this.tweetRepository.getTweetById(query.tweetId);
        return tweet ? TweetMapper.toClient(tweet) : null;
    }
}

module.exports = GetTweetByIdHandler;
