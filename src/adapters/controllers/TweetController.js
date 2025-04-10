const CreateTweetCommand = require('../../core/services/features/tweet/commands/CreateTweetCommand/CreateTweetCommand');
const UpdateTweetCommand = require('../../core/services/features/tweet/commands/UpdateTweetCommand/UpdateTweetCommand');
const DeleteTweetCommand = require('../../core/services/features/tweet/commands/DeleteTweetCommand/DeleteTweetCommand');
const GetTweetByIdQuery = require('../../core/services/features/tweet/queries/GetTweetByIdQuery/GetTweetByIdQuery');
const GetTweetsByUsernameQuery = require('../../core/services/features/tweet/queries/GetTweetsByUsernameQuery/GetTweetsByUsernameQuery');
const GetFeedQuery = require('../../core/services/features/tweet/queries/GetFeedQuery/GetFeedQuery');

/**
 * @swagger
 * tags:
 *   name: Tweet
 *   description: Tweets de los usuarios
 */
class TweetController {
    constructor(
        createTweetHandler,
        updateTweetHandler,
        deleteTweetHandler,
        getTweetByIdHandler,
        getTweetsByUsernameHandler,
        getFeedHandler
    ) {
        this.createTweetHandler = createTweetHandler;
        this.updateTweetHandler = updateTweetHandler;
        this.deleteTweetHandler = deleteTweetHandler;
        this.getTweetByIdHandler = getTweetByIdHandler;
        this.getTweetsByUsernameHandler = getTweetsByUsernameHandler;
        this.getFeedHandler = getFeedHandler;
    }

    /**
     * @swagger
     * /{username}/tweets:
     *   get:
     *     summary: Obtener los tweets de un usuario específico con paginación
     *     tags:
     *       - Tweet
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: username
     *         schema:
     *           type: string
     *         required: true
     *         description: Nombre de usuario del que se quieren obtener los tweets
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         required: false
     *         description: Número de página para la paginación
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         required: false
     *         description: Número de tweets por página
     *     responses:
     *       200:
     *         description: Lista de tweets
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 tweets:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Tweet'
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     *                 totalPages:
     *                   type: integer
     *                 totalTweets:
     *                   type: integer
     *       400:
     *         description: Username es requerido
     *       500:
     *         description: Error del servidor
     */
    async getTweets(req, res) {
        try {
            const username = req.params.username;
            const myUserId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const query = new GetTweetsByUsernameQuery(myUserId, username, page, limit);
            const tweets = await this.getTweetsByUsernameHandler.handle(query);

            res.status(200).json(tweets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /tweets/{id_tweet}:
     *   get:
     *     summary: Obtener un tweet por su ID
     *     tags:
     *       - Tweet
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id_tweet
     *         schema:
     *           type: string
     *         required: true
     *         description: ID del tweet
     *     responses:
     *       200:
     *         description: Detalles del tweet
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tweet'
     *       404:
     *         description: Tweet no encontrado
     *       500:
     *         description: Error del servidor
     */
    async getTweetById(req, res) {
        try {
            const { id_tweet } = req.params;
            const query = new GetTweetByIdQuery(id_tweet);
            const tweet = await this.getTweetByIdHandler.handle(query);
            if (!tweet) {
                return res.status(404).json({ message: 'Tweet not found' });
            }
            res.status(200).json(tweet);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /tweets:
     *   post:
     *     summary: Crear un nuevo tweet
     *     tags:
     *       - Tweet
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - message
     *             properties:
     *               message:
     *                 type: string
     *                 description: Contenido del tweet
     *                 maxLength: 280
     *     responses:
     *       201:
     *         description: Tweet creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Tweet published successfully"
     *                 tweet:
     *                   $ref: '#/components/schemas/Tweet'
     *       400:
     *         description: Error en la solicitud
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error del servidor
     */
    async createTweet(req, res) {
        try {
            const userId = req.user.id;
            const { message } = req.body;

            const command = new CreateTweetCommand({ message, createdBy: userId });
            const tweet = await this.createTweetHandler.handle(command);

            res.status(201).json({ message: 'Tweet published successfully', tweet });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /tweets/{id_tweet}:
     *   put:
     *     summary: Actualizar un tweet existente
     *     tags:
     *       - Tweet
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id_tweet
     *         schema:
     *           type: string
     *         required: true
     *         description: ID del tweet a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - message
     *             properties:
     *               message:
     *                 type: string
     *                 description: Nuevo contenido del tweet
     *                 maxLength: 280
     *     responses:
     *       200:
     *         description: Tweet actualizado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Tweet updated successfully"
     *                 updatedTweet:
     *                   $ref: '#/components/schemas/Tweet'
     *       400:
     *         description: Error en la solicitud
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Tweet no encontrado
     *       500:
     *         description: Error del servidor
     */
    async updateTweet(req, res) {
        try {
            const { id_tweet } = req.params;
            const { message } = req.body;

            const command = new UpdateTweetCommand(id_tweet, message);
            const updatedTweet = await this.updateTweetHandler.handle(command);

            !updatedTweet ?
                res.status(404).json({ message: 'Tweet not found' })
                :
                res.status(200).json({ message: 'Tweet updated successfully', updatedTweet });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /tweets/{id_tweet}:
     *   delete:
     *     summary: Eliminar un tweet por su ID
     *     tags:
     *       - Tweet
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id_tweet
     *         schema:
     *           type: string
     *         required: true
     *         description: ID del tweet a eliminar
     *     responses:
     *       200:
     *         description: Tweet eliminado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Tweet deleted successfully"
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Tweet no encontrado
     *       500:
     *         description: Error del servidor
     */
    async deleteTweet(req, res) {
        try {
            const { id_tweet } = req.params;
            const command = new DeleteTweetCommand(id_tweet);
            await this.deleteTweetHandler.handle(command);
            res.status(200).json({ message: 'Tweet deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /feed:
     *   get:
     *     summary: Obtener tweets de los usuarios seguidos
     *     tags:
     *       - Tweet
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         required: false
     *         description: Número de página para la paginación
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         required: false
     *         description: Número de tweets por página
     *     responses:
     *       200:
     *         description: Lista de tweets del feed
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 tweets:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Tweet'
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     *                 totalPages:
     *                   type: integer
     *                 totalTweets:
     *                   type: integer
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error del servidor
     */
    async getFeed(req, res) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const query = new GetFeedQuery(userId, page, limit);
            const tweets = await this.getFeedHandler.handle(query);

            res.status(200).json(tweets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TweetController;
