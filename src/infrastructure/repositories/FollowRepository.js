const { FollowModel } = require('../database/models/FollowModel');

class FollowRepository {
    async countFollowers(userId) {
        try {
            return await FollowModel.countDocuments({ following: userId });
        } catch (error) {
            throw new Error('Error counting followers');
        }
    }

    async countFollowing(userId) {
        try {
            return await FollowModel.countDocuments({ follower: userId });
        } catch (error) {
            throw new Error('Error counting following users');
        }
    }

    async getFollowers(myUserId, userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
    
            const followingUserIds = await this.getFollowingUserIds(myUserId);
    
            const followers = await FollowModel.find({ following: userId })
                .populate('follower', 'name username')
                .sort({ 'follower.name': 1 })
                .skip(skip)
                .limit(limit);
    
            const totalFollowers = await FollowModel.countDocuments({ following: userId });
    
            return {
                followers: followers.map(f => ({
                    name: f.follower.name,
                    username: f.follower.username,
                    following: followingUserIds.some(followingId => followingId.toString() === f.follower._id.toString())
                })),
                page,
                limit,
                totalPages: Math.ceil(totalFollowers / limit),
                totalFollowers,
            };
        } catch (error) {
            throw new Error('Error retrieving followers');
        }
    }    

    async getFollowing(myUserId, userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const followingUserIds = await this.getFollowingUserIds(myUserId);
    
            const following = await FollowModel.find({ follower: userId })
                .populate('following', 'name username')
                .sort({ 'following.name': 1 })
                .skip(skip)
                .limit(limit);

            const totalFollowing = await FollowModel.countDocuments({ follower: userId });
    
            return {
                following: following.map(f => ({
                    name: f.following.name,
                    username: f.following.username,
                    following: followingUserIds.some(followingId => followingId.toString() === f.following._id.toString())
                })),
                page,
                limit,
                totalPages: Math.ceil(totalFollowing / limit),
                totalFollowing,
            };
        } catch (error) {
            throw new Error('Error retrieving following users');
        }
    }    

    async followUser(followerId, followingId) {
        try {
            const existingFollow = await FollowModel.findOne({ follower: followerId, following: followingId });
            if (!existingFollow) {
                const newFollow = new FollowModel({ follower: followerId, following: followingId });
                return await newFollow.save();
            }
            return null;
        } catch (error) {
            throw new Error('Error creating follow relationship');
        }
    }

    async getFollowingUserIds(userId) {
        try {
            const following = await FollowModel.find({ follower: userId }, 'following');
            return following.map(f => f.following);
        } catch (error) {
            throw new Error('Error retrieving following user IDs');
        }
    }

    async isFollowing(followerId, followingId) {
        try {
            const follow = await FollowModel.findOne({ follower: followerId, following: followingId });
            return !!follow;
        } catch (error) {
            throw new Error('Error checking follow status');
        }
    }
}

module.exports = FollowRepository;