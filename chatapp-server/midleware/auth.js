const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({ message: "Please login." });
    }

    const decode = jwt.verify(token, "shhhhh");
    req.user = await userModel.findById(decode.user_id);
    
    if (!req.user) {
      return res.status(404).send({ message: "User not found" });
    }
    
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired, please login again" });
    }
    return res.status(500).send({ message: "Authentication failed" });
  }
};
