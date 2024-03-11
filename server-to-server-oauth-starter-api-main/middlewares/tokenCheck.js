const { getToken, setToken } = require("../utils/token");
const TokenModel = require("../models/TokenModel");

/**
 * Middleware that checks if a valid (not expired) token exists in token's collection
 * If invalid or expired, generate a new token, set in token, and append to http request
 */
const tokenCheck = async (req, res, next) => {
  let tokenData = await TokenModel.findOne().sort({ expires_in: -1 });
  const currentTime = new Date();

  if (!tokenData || new Date(tokenData.expires_in) <= currentTime) {
    const { access_token, expires_in, error } = await getToken();

    if (error) {
      const { response, message } = error;
      return res
        .status(response?.status || 401)
        .json({ message: `Authentication Unsuccessful: ${message}` });
    }

    // Set the new token
    await setToken({ access_token, expires_in });
    tokenData = { access_token, expires_in };
  }

  req.headerConfig = {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  };
  return next();
};

module.exports = {
  tokenCheck,
};
