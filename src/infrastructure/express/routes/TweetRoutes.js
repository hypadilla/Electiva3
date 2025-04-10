const express = require('express');
const TweetController = require('../../../adapters/controllers/TweetController');
const {
    validateTweetCreation,
    validateTweetUpdate
} = require('../middlewares/TweetMiddleware');
const { authMiddleware } = require('../middlewares/AuthMiddleware');

const CreateTweetHandler = require('../../../core/services/features/tweet/commands/CreateTweetCommand/CreateTweetHandler');
const UpdateTweetHandler = require('../../../core/services/features/tweet/commands/UpdateTweetCommand/UpdateTweetHandler');
const DeleteTweetHandler = require('../../../core/services/features/tweet/commands/DeleteTweetCommand/DeleteTweetHandler');
const GetTweetByIdHandler = require('../../../core/services/features/tweet/queries/GetTweetByIdQuery/GetTweetByIdHandler');
const GetTweetsByUsernameHandler = require('../../../core/services/features/tweet/queries/GetTweetsByUsernameQuery/GetTweetsByUsernameHandler');
const GetFeedHandler = require('../../../core/services/features/tweet/queries/GetFeedQuery/GetFeedHandler');

const TweetRepository = require('../../repositories/TweetRepository');
const UserRepository = require('../../repositories/UserRepository');
const FollowRepository = require('../../repositories/FollowRepository');

module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();

    const tweetRepository = new TweetRepository();
    const userRepository = new UserRepository();
    const followRepository = new FollowRepository();

    const createTweetHandler = new CreateTweetHandler(tweetRepository);
    const updateTweetHandler = new UpdateTweetHandler(tweetRepository);
    const deleteTweetHandler = new DeleteTweetHandler(tweetRepository);
    const getTweetByIdHandler = new GetTweetByIdHandler(tweetRepository);
    const getTweetsByUsernameHandler = new GetTweetsByUsernameHandler(userRepository, tweetRepository, followRepository);
    const getFeedHandler = new GetFeedHandler(tweetRepository, followRepository);

    const tweetController = new TweetController(
        createTweetHandler,
        updateTweetHandler,
        deleteTweetHandler,
        getTweetByIdHandler,
        getTweetsByUsernameHandler,
        getFeedHandler
    );

    router.get('/:username/tweets', authMiddleware(authService, tokenBlacklist), (req, res) => tweetController.getTweets(req, res));
    router.get('/tweets/:id_tweet', authMiddleware(authService, tokenBlacklist), (req, res) => tweetController.getTweetById(req, res));
    router.post('/tweets', authMiddleware(authService, tokenBlacklist), validateTweetCreation, (req, res) => tweetController.createTweet(req, res));
    router.put('/tweets/:id_tweet', authMiddleware(authService, tokenBlacklist), validateTweetUpdate, (req, res) => tweetController.updateTweet(req, res));
    router.delete('/tweets/:id_tweet', authMiddleware(authService, tokenBlacklist), (req, res) => tweetController.deleteTweet(req, res));
    router.get('/feed', authMiddleware(authService, tokenBlacklist), (req, res) => tweetController.getFeed(req, res));

    return router;
};
