import { sendAlert } from "../services/alertService.js";
import { getStockData } from "../services/stockDataService.js";
import { isValidPrice, isValidTicker } from "../utils/validator.js";

const WAIT_INTERVAL = 1000;

async function waitForTargetPrice(ticker, targetPrice, socket) {
  const startTime = Date.now();
  let currentPrice = await getStockData(ticker);

  while (currentPrice < targetPrice) {
    const elapsedTime = Date.now() - startTime;
    const formattedTime = new Date(elapsedTime).toISOString().substring(11, 8);
    socket.emit("stockUpdate", {
      ticker,
      currentPrice,
      formattedTime,
    });
    await sleep(WAIT_INTERVAL);
    currentPrice = await getStockData(ticker);
  }

  return {
    currentPrice,
    formattedTime: new Date(Date.now() - startTime)
      .toISOString()
      .substring(11, 19),
  };
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

      const { currentPrice, formattedTime } = await waitForTargetPrice(
        ticker,
        parseFloat(price),
        req.app.get("io")
      );

      const alertMessage = sendAlert(ticker, price, formattedTime);

      req.app.get("io").emit("stockAlert", { alert: alertMessage });
      return res.json({ currentPrice, alert: alertMessage });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default stockController;
