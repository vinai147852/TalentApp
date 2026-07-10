const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
  const AuthHeader = req.headers.token;
  if (AuthHeader) {
    const token = AuthHeader.split(' ')[1];
    jwt.verify(token, process.env.JWTKEY, (err, user) => {
      if (err) {
        res.status(401).json('Session expired please login again!');
        return;
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json('You are not Authorized');
  }
};

const VerifyTokenAndAdmin = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.userId === req.body.userId || req.user.role === 1) {
      next();
    } else {
      res.status(401).json('You are not Authorized');
    }
  });
};

const VerifyTokenAndAuth = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.userId === req.body.userId) {
      next();
    } else {
      res.status(401).json('You are not Authorized');
    }
  });
};

module.exports = { VerifyToken, VerifyTokenAndAuth, VerifyTokenAndAdmin };
