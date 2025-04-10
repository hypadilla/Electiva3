const express = require('express');
const UserRoutes = require('./UserRoutes');
const FollowRoutes = require('./FollowRoutes');
const TweetRoutes = require('./TweetRoutes');
const AuthRoutes = require('./AuthRoutes');

const router = express.Router();

module.exports = ({ authService, tokenBlacklist }) => {
    router.use(UserRoutes({ authService, tokenBlacklist }));
    router.use(AuthRoutes({ authService, tokenBlacklist }));
    router.use(FollowRoutes({ authService, tokenBlacklist }));
    router.use(TweetRoutes({ authService, tokenBlacklist }));
    return router;
};
