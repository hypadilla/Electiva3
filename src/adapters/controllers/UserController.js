const CreateUserCommand = require('../../core/services/features/user/commands/CreateUserCommand/CreateUserCommand');
const GetAuthenticatedUserQuery = require('../../core/services/features/user/queries/GetAuthenticatedUserQuery/GetAuthenticatedUserQuery');
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gestión de usuarios
 */
class UserController {
    constructor(
        createUserHandler,
        getAuthenticatedUserHandler
    ) {
        this.createUserHandler = createUserHandler;
        this.getAuthenticatedUserHandler = getAuthenticatedUserHandler;
    }

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Registrar un nuevo usuario
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - password
     *               - email
     *               - name
     *             properties:
     *               username:
     *                 type: string
     *                 description: El nombre de usuario del nuevo usuario
     *               password:
     *                 type: string
     *                 format: password
     *                 description: La contraseña del nuevo usuario
     *               email:
     *                 type: string
     *                 description: El correo electrónico del nuevo usuario
     *               name:
     *                 type: string
     *                 description: El nombre del nuevo usuario
     *     responses:
     *       201:
     *         description: Usuario registrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Solicitud incorrecta
     *       500:
     *         description: Error interno del servidor
     */
    async registerUser(req, res) {
        try {
            const { username, password, email, name } = req.body;
            const command = new CreateUserCommand(username, password, email, name);
            const user = await this.createUserHandler.handle(command);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            if (error.message.includes('username') || error.message.includes('email')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'An error occurred while registering the user' });
        }
    }

    /**
     * @swagger
     * /me:
     *   get:
     *     summary: Obtener detalles del usuario autenticado
     *     tags: [User]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Detalles del usuario autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Usuario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async getAuthenticatedUser(req, res) {
        try {
            const userId = req.user.id;
            const query = new GetAuthenticatedUserQuery(userId);
            const user = await this.getAuthenticatedUserHandler.handle(query);
            res.status(200).json(user);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = UserController;
