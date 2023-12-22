import express from "express";
import http from "http";
import bodyParser from "body-parser";
import stockRoutes from "./routes/stockRoute.js";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

//Middleware
app.use(bodyParser.json());
app.use(cors());
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

server.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
