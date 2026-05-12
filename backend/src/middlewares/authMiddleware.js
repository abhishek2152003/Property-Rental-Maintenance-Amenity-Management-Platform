const jwt = require("jsonwebtoken")
const verifyToken = (req, res, next) => {

    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "no token, authorization denied" })
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();

    } catch (error) {
        res.status(400).json({ message: "Token is not valid" })
    }
}
const authorizeRoles = (req, res, next) => {
    if (req.user.role !== "owner") {
        return res.status(403).json({ message: "Access denied: Owners only" });
    }

    next();
};

module.exports = { verifyToken, authorizeRoles };