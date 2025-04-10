const { TweetModel } = require('../database/models/TweetModel');
const TweetMapper = require('../../core/services/mapping/TweetMapper');

class TweetRepository{
    async createTweet(tweetData) {
        const tweetDocument = new TweetModel(TweetMapper.toPersistence(tweetData));
        const savedTweet = await tweetDocument.save();
        const populatedTweet = await TweetModel.findById(savedTweet._id)
            .populate('createdBy', 'name username');
        return TweetMapper.toDomain(populatedTweet);
    }

    async getTweetsByUserId(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const tweets = await TweetModel.find({ createdBy: userId })
            .sort({ createdDate: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name username');

        const totalTweets = await TweetModel.countDocuments({ createdBy: userId });
        return {
            tweets: tweets.map(tweet => TweetMapper.toDomain(tweet)),
            page,
            limit,
            totalPages: Math.ceil(totalTweets / limit),
            totalTweets,
        };
    }

    async getTweetById(tweetId) {
        const tweetDocument = await TweetModel.findById(tweetId)
            .populate('createdBy', 'name username');
        return tweetDocument ? TweetMapper.toDomain(tweetDocument) : null;
    }


    async updateTweet(tweetId, message) {
        const updatedTweet = await TweetModel.findByIdAndUpdate(
            tweetId,
            { message, lastModifiedDate: Date.now() },
            { new: true }
        ).populate('createdBy', 'name username');

        return updatedTweet ? TweetMapper.toDomain(updatedTweet) : null;
    }

    async deleteTweetById(tweetId) {
        await TweetModel.findByIdAndDelete(tweetId);
    }

    async getTweetsByUserIds(userIds, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const tweets = await TweetModel.find({ createdBy: { $in: userIds } })
            .sort({ createdDate: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name username');

        const totalTweets = await TweetModel.countDocuments({ createdBy: { $in: userIds } });
        return {
            tweets: tweets.map(tweet => TweetMapper.toDomain(tweet)),
            page,
            limit,
            totalPages: Math.ceil(totalTweets / limit),
            totalTweets,
        };
    }
}

module.exports = TweetRepository;
