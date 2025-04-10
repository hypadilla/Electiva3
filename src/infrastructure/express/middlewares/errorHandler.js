const errorHandler = (err, req, res, next) => {
    console.error(err.message, err);
    res.status(500).json({ message: 'An internal server error occurred.' });
};

module.exports = errorHandler;