import { sendAlert } from "../services/alertService.js";
import { getStockData } from "../services/stockDataService.js";
import { isValidPrice, isValidTicker } from "../utils/validator.js";

const stockController = {
  async getStock(req, res) {
    try {
      const { ticker, price } = req.params;
      if (!isValidTicker(ticker) || !isValidPrice(price)) {
        return res.status(400).json({ error: "Invalid ticker or price" });
      }

      const currentPrice = await getStockData(ticker);
      if (currentPrice >= parseFloat(price)) {
        const alertMessage = sendAlert(ticker, price);
        return res.json({ currentPrice, alert: alertMessage });
      }
      return res.json({ currentPrice });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default stockController;
