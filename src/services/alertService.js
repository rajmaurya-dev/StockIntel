function sendAlert(ticker, price) {
  const alterMessage = {
    type: "stock-alert",
    ticker: ticker,
    price,
    message: `The stock ${ticker} has reached the target price of ${price}.`,
  };
  console.log(alterMessage);
  return alterMessage;
}

export { sendAlert };
