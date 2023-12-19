import yahooFinance from "yahoo-finance2";

async function getStockData(ticker) {
  try {
    const data = await yahooFinance.quote(ticker);

    if (data && data.regularMarketPrice) {
      return data.regularMarketPrice;
    } else {
      throw new Error(`No data found for ${ticker}`);
    }
  } catch (error) {
    console.log(`Error in getStockData: ${error}`);
    throw error;
  }
}

export { getStockData };
