const TweetMapper = require('../../../../mapping/TweetMapper');

class GetTweetsByUserIdHandler {
    constructor(tweetRepository) {
        this.tweetRepository = tweetRepository;
    }

    async handle(query) {
        const { userId, page, limit } = query;

        const result = await this.tweetRepository.getTweetsByUserId(userId, page, limit);
        result.tweets = result.tweets.map(tweet => TweetMapper.toClient(tweet));
        return result;
    }
}

module.exports = GetTweetsByUserIdHandler;
