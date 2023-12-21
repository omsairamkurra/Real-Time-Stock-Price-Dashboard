const express = require("express");
const axios = require("axios");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 4000;

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const API_KEY = "pIPUrMx3JzOMEzpRADXi1RaU5eOv1zkh";

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    ws.send("Message received!");
  });
});

// API endpoint to fetch stock data for a specific symbol and date
app.get("/stock/:symbol/:date", async (req, res) => {
  const symbol = req.params.symbol;
  const date = req.params.date;
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${date}/${date}?apiKey=${API_KEY}`
    );
    const data = response.data;
    res.json(data);

    // Broadcast live updates via WebSocket when stock data is fetched
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ error: "Error fetching stock data" });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
