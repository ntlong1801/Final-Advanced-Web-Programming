const jwt = require("jsonwebtoken");

const middlewareController = {
  // verify token
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    console.log('token', token);
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token isn't valid!");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You're not authenticated!");
    }
  },
};

module.exports = middlewareController;
