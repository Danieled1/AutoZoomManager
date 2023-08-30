// const redis = require("../configs/redis");
const { getToken, setToken } = require("../utils/token");
const TokenModel = require("../models/TokenModel");

/**
 * Middleware that checks if a valid (not expired) token exists in redis
 * If invalid or expired, generate a new token, set in redis, and append to http request
 */
const tokenCheck = async (req, res, next) => {
  const tokenData = await TokenModel.findOne().sort({ expires_in: -1 });
  let token = tokenData;

  /**
   * Redis returns:
   * -2 if the key does not exist
   * -1 if the key exists but has no associated expire
   */
  if (!tokenData || ["-1", "-2"].includes(tokenData)) {
    const { access_token, expires_in, error } = await getToken();

    if (error) {
      const { response, message } = error;
      return res
        .status(response?.status || 401)
        .json({ message: `Authentication Unsuccessful: ${message}` });
    }

    setToken({ access_token, expires_in });

    token = access_token;
  }

  req.headerConfig = {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  };
  return next();
};

module.exports = {
  tokenCheck,
};
