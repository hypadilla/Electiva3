class CountFollowingHandler {
    constructor(followRepository, userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    async handle(query) {
        const user = await this.userRepository.getByUsername(query.username);
        if (!user) {
            throw new Error('User not found');
        }
        return await this.followRepository.countFollowing(user.id);
    }
}

module.exports = CountFollowingHandler;
