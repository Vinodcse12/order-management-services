exports.verifyToken = function(req, res, next) {
  const bearerHeader = req.headers['authorization']; 
  if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const brarerToken = bearer[1];
      req.token = brarerToken;
      next();

  } else {
      res.sendStatus(403);
  }
 // next();
};