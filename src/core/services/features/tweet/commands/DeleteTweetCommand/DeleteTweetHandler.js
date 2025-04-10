class DeleteTweetHandler {
    constructor(tweetRepository) {
        this.tweetRepository = tweetRepository;
    }

    async handle(command) {
        await this.tweetRepository.deleteTweetById(command.tweetId);
    }
}

module.exports = DeleteTweetHandler;
