import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStock = (ticker, price) => {
  return api.get(`/stocks/${ticker}/target/${price}`);
};
