"use client";
import React, { useState, useEffect } from "react";
import { getStock } from "@/services/api";

import { motion } from "framer-motion";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
const StockTracker = () => {
  const [ticker, setTicker] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [data, setData] = useState(null);
  const [stockUpdate, setStockUpdate] = useState(null);
  const [waiting, setWaiting] = useState("");

  useEffect(() => {
    socket.on("stockAlert", (data) => {
      setData(data);
    });
    socket.on("stockUpdate", (data) => {
      setStockUpdate(data);
    });

    return () => {
      socket.off("stockUpdate");
      socket.off("stockAlert");
    };
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
        <form className="text-gray-800">
          <input
            type="text"
            placeholder="Enter ticker: AAPL, TSLA, AMZN, GOOG"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-gray-300 shadow-inner bg-gray-800"
          />
          <input
            type="number"
            placeholder="Enter target price"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-gray-300 shadow-inner bg-gray-800"
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
            className="bg-black shadow-md rounded px-8 py-2 my-2 flex flex-col uppercase font-semibold text-xs"
          >
            <div className="">
              <p>Current Price: {data.currentPrice}</p>
              <p>
                Alert: {data?.alert.ticker}, {data?.alert.message}
              </p>
            </div>
          </motion.div>
        ) : (
          waiting && <p className="loading">{waiting}</p>
        )}

        {stockUpdate && (
          <motion.div
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="bg-black shadow-md rounded px-8 py-2 my-2 flex flex-col "
          >
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-full px-3 mb-6 md:mb-0">
                <h2 className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                  Stock Updates
                </h2>
                <p className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                  Ticker: {stockUpdate.ticker}
                </p>
                <p className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                  Current Price: {stockUpdate.currentPrice}
                </p>
                <p className="block uppercase tracking-wide text-grey-darker text-xs font-bold ">
                  Time: {stockUpdate.formattedTime}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StockTracker;
