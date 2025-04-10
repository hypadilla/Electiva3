const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connectionDB');
const swaggerDocs = require('./swagger/swagger');
const errorHandler = require('./express/middlewares/errorHandler');
const UserRepository = require("./repositories/UserRepository");
const JwtAuthService = require("./services/JwtAuthService");
const TokenBlacklist = require("./utils/TokenBlacklist");

const userRepository = new UserRepository();
const authService = new JwtAuthService('your-secret-key', '1h', userRepository);
const tokenBlacklist = new TokenBlacklist();

const app = express();


const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'] 
};

app.use(cors(corsOptions)); 
app.use(express.json());

const router = require('./express/routes/ApiRoutes')({ authService, tokenBlacklist });

app.use('/api', router);
app.use(errorHandler);

const startServer = (port) => {
    connectDB();
    const server = app.listen(port, () => console.log(`Server running on port ${port}`));
    swaggerDocs(app, port);
    return server;
};

module.exports = { startServer, app };
