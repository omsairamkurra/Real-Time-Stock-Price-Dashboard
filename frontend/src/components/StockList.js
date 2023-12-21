import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const StockList = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [date, setDate] = useState("2022-01-05");
  const [stockData, setStockData] = useState(null);
  const [chart, setChart] = useState(null);
  const [symbolList, setSymbolList] = useState([
    "AAPL",
    "GOOGL",
    "MSFT",
    "AMZN",
  ]);
  const [refreshInterval, setRefreshInterval] = useState(5000); // Default refresh rate: 5000ms (5 seconds)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/stock/${symbol}/${date}`
        );
        setStockData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [symbol, date]);

  useEffect(() => {
    if (stockData) {
      const ctx = document.getElementById("stockChart");
      if (chart) {
        chart.destroy();
      }
      const data = {
        labels: ["Label1", "Label2", "Label3", "Label4"],
        datasets: [
          {
            label: "Stock Price",
            data: [
              stockData.results?.[0]?.o || 0,
              stockData.results?.[0]?.c || 0,
              stockData.results?.[0]?.h || 0,
              stockData.results?.[0]?.l || 0,
            ],
            borderColor: "blue",
            borderWidth: 1,
            fill: false,
          },
        ],
      };

      const newChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: {
          plugins: {
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
        },
      });

      setChart(newChart);
    }
  }, [stockData]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Periodically update data based on the refresh interval
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/stock/${symbol}/${date}`
      );
      setStockData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSymbol = () => {
    if (!symbolList.includes(symbol)) {
      setSymbolList([...symbolList, symbol]);
    }
  };

  const renderSymbolOptions = () => {
    return (
      <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
        {symbolList.map((sym, index) => (
          <option key={index} value={sym}>
            {sym}
          </option>
        ))}
      </select>
    );
  };
  const renderValue = (value) => {
    if (value > 0) {
      return <span style={{ color: "green" }}>{value}</span>;
    } else if (value < 0) {
      return <span style={{ color: "red" }}>{value}</span>;
    }
    return value;
  };

  return (
    <div>
      <h1>Stock Dashboard</h1>
      <label>
        Select Symbol:
        {renderSymbolOptions()}
        <button onClick={handleAddSymbol}>Add</button>
      </label>
      <br />
      <label>
        Update Interval (ms):
        <input
          type="number"
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
        />
      </label>
      <canvas id="stockChart" width="400" height="200"></canvas>
      {stockData && stockData.results?.length > 0 ? (
        <ul>
          <li>
            <strong>Symbol:</strong> {stockData.ticker || ""}
          </li>
          <li>
            <strong>Volume:</strong>{" "}
            {renderValue(stockData.results[0]?.v) || ""}
          </li>
          <li>
            <strong>Open:</strong> {renderValue(stockData.results[0]?.o) || ""}
          </li>
          <li>
            <strong>Close:</strong> {renderValue(stockData.results[0]?.c) || ""}
          </li>
          <li>
            <strong>High:</strong> {renderValue(stockData.results[0]?.h) || ""}
          </li>
          <li>
            <strong>Low:</strong> {renderValue(stockData.results[0]?.l) || ""}
          </li>
          <li>
            <strong>Time:</strong>{" "}
            {stockData.results[0]?.t
              ? new Date(stockData.results[0]?.t).toLocaleString()
              : ""}
          </li>
        </ul>
      ) : (
        <p>No stock data available</p>
      )}
    </div>
  );
};

export default StockList;
