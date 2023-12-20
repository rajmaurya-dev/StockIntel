"use client";
import React, { useState, useEffect } from "react";
import { getStock } from "@/services/api";
import io from "socket.io-client";
import { motion } from "framer-motion";
const StockTracker = () => {
  const [ticker, setTicker] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [data, setData] = useState(null);
  const [waiting, setWaiting] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("stockAlert", (data) => {
      setData(data);
    });

    return () => socket.disconnect();
  }, []);

  const startTracking = async (e) => {
    e.preventDefault();
    setData(null);
    setWaiting("Waiting for target price...");
    try {
      const response = await getStock(ticker, targetPrice);
      setData(response.data);
      setWaiting("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="p-8 rounded-lg shadow-lg bg-gray-800 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Stock Tracker</h1>
        <form>
          <input
            type="text"
            placeholder="Enter ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-gray-300 shadow-inner"
          />
          <input
            type="number"
            placeholder="Enter target price"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-gray-300 shadow-inner"
          />
          <button
            onClick={startTracking}
            className="w-full p-2 rounded bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
          >
            Start Tracking
          </button>
        </form>
        {data ? (
          <motion.div
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <div className="p-8 my-2 rounded-lg shadow-lg bg-gray-400 w-full max-w-md">
              <p>Current Price: {data.currentPrice}</p>
              <p>
                Alert: {data.alert.ticker}, {data.alert.message}
              </p>
            </div>
          </motion.div>
        ) : (
          waiting && <p className="loading">{waiting}</p>
        )}
      </motion.div>
    </div>
  );
};

export default StockTracker;
