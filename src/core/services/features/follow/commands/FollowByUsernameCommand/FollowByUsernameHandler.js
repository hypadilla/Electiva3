class FollowByUsernameHandler {
    constructor(userRepository, followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    async handle(command) {
        const userToFollow = await this.userRepository.getByUsername(command.username);
        if (!userToFollow) {
            throw new Error('User not found');
        }
        const followRecord = await this.followRepository.followUser(command.followerId, userToFollow.id);
        return followRecord ? followRecord : null;
    }
}

module.exports = FollowByUsernameHandler;
