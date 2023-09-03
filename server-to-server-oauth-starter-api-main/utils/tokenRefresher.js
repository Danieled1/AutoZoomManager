const TokenModel = require("../models/TokenModel");
const { getToken, setToken } = require("./token");

const refreshInterval = 1000 * 60 * 55; // 55 minutes in milliseconds

const startTokenRefreshLoop = async () => {
  setInterval(async () => {
    const currentTime = new Date();
    const tokenData = await TokenModel.findOne().sort({ expires_in: -1 });

    if (!tokenData || new Date(tokenData.expires_in) <= currentTime) {
      const { access_token, expires_in, error } = await getToken();
      if (!error) {
        await setToken({ access_token, expires_in });
      }
    }
  }, refreshInterval);
};

module.exports = startTokenRefreshLoop;
