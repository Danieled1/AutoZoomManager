// const redis = require("./configs/redis");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { debug } = require("node:console");
const { tokenCheck } = require("./middlewares/tokenCheck");
const connectDB = require("./configs/mongo");
const TokenModel = require("./models/TokenModel");
const tokenState = require("./utils/tokenRefresher"); // Assuming tokenRefresher is the new module

const app = express();

tokenState.initialize();
connectDB();

app.use(cookieParser());

app.use(
  cors({
    origin: [
      // "https://zoom-generator-backend-9b73668fa08e.herokuapp.com",
      "*",
      "https://zoom-generator-frontend-6acfe2abb78d.herokuapp.com",
      "http://ec2-3-80-182-53.compute-1.amazonaws.com:8001",
      "http://localhost:8000",
      "http://localhost:8001",
      "http://localhost:8080",
    ],
  })
);

app.use([express.json(), express.urlencoded({ extended: false })]);

app.options("*", cors());
/**
  Add API Routes w/ tokenCheck middleware
 */
app.use("/api/users", tokenCheck, require("./routes/api/users"));
app.use("/api/meetings", tokenCheck, require("./routes/api/meetings"));
app.use("/api/zoom-users", tokenCheck, require("./routes/api/zoom-users"));
app.use("/api/webhooks", tokenCheck, require("./routes/api/webhooks"));
app.get("/", (req, res) => {
  res.status(200).send("Backend API is running");
});
/**
 *    API Route Breakdown:
 *    __Users__
 *    GET     /api/users --> list users -
 *    POST    /api/users/add --> create users -
 *    GET     /api/users/:userId --> get a user -
 *    GET     /api/users/:userId/settings --> get user settings -
 *    PATCH   /api/users/:userId/settings --> update user settings -
 *    PATCH   /api/users/:userId --> update a user -
 *    DELETE  /api/users/:userId --> delete a user -
 *    GET     /api/users/:userId/meetings --> list meetings -
 *    GET     /api/users/:userId/webinars --> list webinars -
 *    GET     /api/users/:userId/recordings --> list all recordings -
 *
 *    __Meetings__
 *    GET     /api/meetings/:meetingId --> get a meeting -
 *    POST    /api/meetings/:userId -> create a meeting -
 *    PATCH   /api/meetings/:meetingId --> update a meeting -
 *    DELETE  /api/meetings/:meetingId --> delete a meeting -
 *    GET     /api/meetings/:meetingId/report/participants --> get meeting participant reports -
 *    DELETE  /api/meetings/:meetingId/recordings --> delete meeting recordings -
 */

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () =>
  console.log(`Listening on port ${[PORT]}!`)
);

/**
 * Graceful shutdown, removes access_token from mongo
 */
const cleanup = async () => {
  debug("\nClosing HTTP server");
  const currentAccessToken = tokenState.getAccessToken();
  if (currentAccessToken) {
    await TokenModel.deleteOne({ access_token: currentAccessToken });
  }
  server.close(() => {
    debug("\nHTTP server closed");
    process.exit();
  });
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
