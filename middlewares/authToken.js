const jwt = require("jsonwebtoken");
const { responseToUser } = require("../utils/response");

function authToken(req, res, next) {
  const bearerToken = req.header("Authorization");
  try {
    if (typeof bearerToken !== undefined) {
      const res = bearerToken.split(" ");
      const token = res[1];
      if (!token)
        return res
          .status(401)
          .send("You are not authorized to perform this task.");
      const verified = jwt.verify(token, process.env.SECRET_TOKEN);
      req.user = verified;
      next();
    }
  } catch (error) {
    res
      .status(401)
      .json(
        responseToUser(
          false,
          401,
          "You are not authorized to perform this task"
        )
      );
  }
}

const verifyRefresh = async (req, res, next) =>{
    
  try {
    const verified = await jwt.verify(
      req.body.refresh_token,
      process.env.REFRESH_SECRET_TOKEN
    );
    if (verified) {
      const access_token = await jwt.sign(
        { email: req.body.email },
        process.env.SECRET_TOKEN,
        { expiresIn: "15m" }
      );
      res
        .status(200)
        .json(
          responseToUser(
            true,
            200,
            "Refresh token verified and new access token sent",
            { access_token: access_token }
          )
        );
    
    }
    // return decoded.email === req.body.email;
  } catch (error) {
    console.error(error);
    //    console.log(error,"error")
    return false;
  }
}

module.exports = { authToken, verifyRefresh };
