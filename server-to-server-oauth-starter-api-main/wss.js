const WebSocket = require("ws");

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", (message) => {
    console.log("Received message from client:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected from WebSocket");
  });
});

module.exports = wss;
