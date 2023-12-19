import express from "express";
import http from "http";
import bodyParser from "body-parser";
import stockRoutes from "./routes/stockRoute.js";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server);

//Middleware
app.use(bodyParser.json());
app.use("/api", stockRoutes);

//Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("message", "Welcome to StockIntel");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
app.set("io", io);
app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
