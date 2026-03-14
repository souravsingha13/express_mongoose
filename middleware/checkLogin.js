const jwt = require('jsonwebtoken');
const checkLogin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: "Unauthorized" });
    }
};
module.exports = checkLogin;