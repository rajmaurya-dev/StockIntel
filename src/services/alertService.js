function sendAlert(ticker, price, timestamp) {
  const alterMessage = {
    type: "stock-alert",
    ticker: ticker,
    price,
    message: `The stock ${ticker} has reached the target price of ${price}.`,
    timestamp,
  };
  console.log(alterMessage);
  return alterMessage;
}

export { sendAlert };
