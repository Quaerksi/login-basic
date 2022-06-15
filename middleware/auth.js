const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {

    // const token =
    // req.body.token || req.query.token || req.headers["x-access-token"];
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        //verify with function has (error, user)
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.email = decoded.email;
        return next();
        
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    
}

module.exports = verifyToken;
