import jwt from 'jsonwebtoken';

export const authToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log('token=',token)
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "Token not provided",
      });
    }

    jwt.verify(token, process.env.Secret_Key, (err, decoded) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: "Invalid token",
        });
      }
      req.userId = decoded.userId;
      // console.log('decoded.userId', decoded.userId);
      next();
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
