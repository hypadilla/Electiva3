const FollowByUsernameCommand = require('../../core/services/features/follow/commands/FollowByUsernameCommand/FollowByUsernameCommand');
const CountFollowersQuery = require('../../core/services/features/follow/queries/CountFollowersQuery/CountFollowersQuery');
const CountFollowingQuery = require('../../core/services/features/follow/queries/CountFollowingQuery/CountFollowingQuery');
const GetFollowersQuery = require('../../core/services/features/follow/queries/GetFollowersQuery/GetFollowersQuery');
const GetFollowingQuery = require('../../core/services/features/follow/queries/GetFollowingQuery/GetFollowingQuery');

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Operaciones relacionadas con seguidores y seguidos
 */
class FollowController {
    constructor(
        followByUsernameHandler,
        countFollowersHandler,
        countFollowingHandler,
        getFollowersHandler,
        getFollowingHandler
    ) {
        this.followByUsernameHandler = followByUsernameHandler;
        this.countFollowersHandler = countFollowersHandler;
        this.countFollowingHandler = countFollowingHandler;
        this.getFollowersHandler = getFollowersHandler;
        this.getFollowingHandler = getFollowingHandler;
    }

    /**
     * @swagger
     * /{username}/follow:
     *   post:
     *     summary: Seguir a un usuario por su nombre de usuario
     *     tags: [Follow]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: username del usuario
     *     responses:
     *       201:
     *         description: Usuario seguido exitosamente
     *       400:
     *         description: Ya sigues a este usuario
     *       404:
     *         description: Usuario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async followByUsername(req, res) {
        try {
            const followerId = req.user.id;
            const { username } = req.params;
            const command = new FollowByUsernameCommand(followerId, username);
            const result = await this.followByUsernameHandler.handle(command);
            if (result) {
                res.status(201).json({ message: 'Now following user' });
            } else {
                res.status(400).json({ message: 'Already following this user' });
            }
        } catch (error) {
            if (error.message === 'User not found') {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.status(500).json({ message: 'An error occurred while following the user' });
            }
        }
    }

    /**
     * @swagger
     * /{username}/followers/count:
     *   get:
     *     summary: Obtener el conteo de seguidores de un usuario
     *     tags: [Follow]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: username del usuario
     *     responses:
     *       200:
     *         description: Conteo de seguidores
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 followers:
     *                   type: integer
     *                   example: 5
     *       500:
     *         description: Error interno del servidor
     */
    async getFollowerCount(req, res) {
        try {
            const { username } = req.params;
            const query = new CountFollowersQuery(username);
            const followersCount = await this.countFollowersHandler.handle(query);
            res.status(200).json({ followers: followersCount });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving the follower count' });
        }
    }

    /**
     * @swagger
     * /{username}/following/count:
     *   get:
     *     summary: Obtener el conteo de usuarios que sigue un usuario
     *     tags: [Follow]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: username del usuario
     *     responses:
     *       200:
     *         description: Conteo de usuarios seguidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 following:
     *                   type: integer
     *                   example: 10
     *       500:
     *         description: Error interno del servidor
     */
    async getFollowingCount(req, res) {
        try {
            const { username } = req.params;
            const query = new CountFollowingQuery(username);
            const followingCount = await this.countFollowingHandler.handle(query);
            res.status(200).json({ following: followingCount });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving the following count' });
        }
    }

    /**
     * @swagger
     * /{username}/followers:
     *   get:
     *     summary: Obtener una lista de seguidores de un usuario
     *     tags: [Follow]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: username del usuario
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Número de página para la paginación
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Número de resultados por página
     *     responses:
     *       200:
     *         description: Lista de seguidores
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 followers:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       name:
     *                         type: string
     *                         example: "Juan Pérez"
     *                       username:
     *                         type: string
     *                         example: "juanperez"
     *       500:
     *         description: Error interno del servidor
     */
    async getFollowers(req, res) {
        try {
            const { username } = req.params;
            const myUserId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const query = new GetFollowersQuery(myUserId, username, page, limit);
            const followers = await this.getFollowersHandler.handle(query);
            res.status(200).json( followers );
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving followers' });
        }
    }

    /**
     * @swagger
     * /{username}/following:
     *   get:
     *     summary: Obtener una lista de usuarios que sigue un usuario
     *     tags: [Follow]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: username del usuario
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Número de página para la paginación
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Número de resultados por página
     *     responses:
     *       200:
     *         description: Lista de usuarios seguidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 following:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       name:
     *                         type: string
     *                         example: "María García"
     *                       username:
     *                         type: string
     *                         example: "mariagarcia"
     *       500:
     *         description: Error interno del servidor
     */
    async getFollowing(req, res) {
        try {
            const { username } = req.params;
            const myUserId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const query = new GetFollowingQuery(myUserId, username, page, limit);
            const following = await this.getFollowingHandler.handle(query);
            res.status(200).json( following );
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving following users' });
        }
    }
}

module.exports = FollowController;