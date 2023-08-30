const TokenModel = require("../models/TokenModel");
const axios = require("axios");
const qs = require("query-string");
const { ZOOM_OAUTH_ENDPOINT } = require("../constants");

/**
 * Retrieve token from Zoom API
 *
 * @returns {Object} { access_token, expires_in, error }
 */
const getToken = async () => {
  try {
    const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

    const request = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      qs.stringify({
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const { access_token, expires_in } = await request.data;
    const newToken = new TokenModel({ access_token, expires_in });
    await newToken.save();
    return { access_token, expires_in, error: null };
  } catch (error) {
    return { access_token: null, expires_in: null, error };
  }
};

/**
 * Set zoom access token with expiration in MongoDB
 *
 * @param {Object} auth_object
 * @param {String} access_token
 * @param {int} expires_in
 */
const setToken = async ({ access_token, expires_in }) => {
  await TokenModel.deleteMany({});

  // Create a new token record in MongoDB
  const newToken = new TokenModel({
    access_token,
    expires_in: new Date(new Date().getTime() + expires_in * 1000), // Convert expires_in to a future date object
  });

  await newToken.save();
};

module.exports = {
  getToken,
  setToken,
};
