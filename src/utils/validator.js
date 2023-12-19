function isValidTicker(ticker) {
  if (ticker === undefined || ticker === null || ticker === "") {
    return false;
  }
  return true;
}
function isValidPrice(price) {
  return !isNaN(parseFloat(price)) && isFinite(price);
}
export { isValidTicker, isValidPrice };
