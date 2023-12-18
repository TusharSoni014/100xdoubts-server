const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        return res.status(500).send({ message: "Unauthorized, login again!" });
      }
      const { _id } = data;
      req._id = _id;
      next();
    });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = verifyToken;
