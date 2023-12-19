import { sendAlert } from "../services/alertService.js";
import { getStockData } from "../services/stockDataService.js";
import { isValidPrice, isValidTicker } from "../utils/validator.js";

const WAIT_INTERVAL = 1000;

async function waitForTargetPrice(ticker, targetPrice, socket) {
  let currentPrice = await getStockData(ticker);

  while (currentPrice < targetPrice) {
    socket.emit("stockUpdate", { ticker, currentPrice });
    await sleep(WAIT_INTERVAL);
    currentPrice = await getStockData(ticker);
  }

  return currentPrice;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const stockController = {
  async getStock(req, res) {
    try {
      const { ticker, price } = req.params;
      if (!isValidTicker(ticker) || !isValidPrice(price)) {
        return res.status(400).json({ error: "Invalid ticker or price" });
      }

      const currentPrice = await waitForTargetPrice(
        ticker,
        parseFloat(price),
        req.app.get("io")
      );

      const alertMessage = sendAlert(ticker, price);

      req.app.get("io").emit("stockAlert", { ticker, alertMessage });
      return res.json({ currentPrice, alert: alertMessage });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default stockController;
