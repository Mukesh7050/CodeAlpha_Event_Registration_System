const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

    try {

        const authHeader = req.header("Authorization");

        if (!authHeader) {

            return res.status(401).json({
                message: "Access Denied. No Token Provided."
            });

        }

        // Remove "Bearer "
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    }

    catch (error) {

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};

module.exports = auth;