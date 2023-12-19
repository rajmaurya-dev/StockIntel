import express from "express";
import bodyParser from "body-parser";
import stockRoutes from "./routes/stockRoute.js";
const app = express();
const PORT = 5000;

//Middleware
app.use(bodyParser.json());
app.use("/api", stockRoutes);
app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
