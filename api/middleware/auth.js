// protects certain API routes by verifying the JWT token
// It runs before the route handler and attaches the userId to the request

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // get the token from the Authorization header
        // the header looks like: "Bearer eyJhbGci..."
        const token = req.headers.authorization?.split(' ')[1];

        // if no token was provided, block the request
        if (!token) return res.status(401).json({ error: 'No token provided' });

        // verify the token is valid and not expired
        // if invalid, jwt.verify will throw an error caught below
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach the userId to the request so routes can use it
        req.userId = decoded.userId;
        // console.log(req.userId);

        // move on to the actual route handler
        next();

    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;