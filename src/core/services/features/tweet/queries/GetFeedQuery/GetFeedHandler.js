const TweetMapper = require('../../../../mapping/TweetMapper');

class GetFeedHandler {
    constructor(tweetRepository, followRepository) {
        this.tweetRepository = tweetRepository;
        this.followRepository = followRepository;
    }

    async handle(query) {
        try {
            const { userId, page, limit } = query;

            const followedUsers = await this.followRepository.getFollowingUserIds(userId);

            const userIds = followedUsers.map(id => id.toString());

            userIds.push(userId);

            const result = await this.tweetRepository.getTweetsByUserIds(userIds, page, limit);
            result.tweets = result.tweets.map(tweet => TweetMapper.toClient(tweet));

            return result;
        } catch (error) {
            throw new Error(`Error retrieving feed: ${error.message}`);
        }
    }
}

module.exports = GetFeedHandler;
