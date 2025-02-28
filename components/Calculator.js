"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaSyncAlt, FaTrash } from "react-icons/fa";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("calculatorHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
  }, [history]);

  const evaluateExpression = (expr) => {
    try {
      if (!/^[0-9+\-*/().\s]+$/.test(expr) || /[+\-*/]$/.test(expr.slice(-1))) return null;
      return new Function(`return ${expr}`)(); 
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (autoCalculate) {
      setResult(evaluateExpression(expression));
    }
  }, [expression, autoCalculate]);

  const handleButtonClick = (value) => {
    setExpression((prev) => {
      if (/[+\-*/]$/.test(prev.slice(-1)) && /[+\-*/]/.test(value)) {
        return prev.slice(0, -1) + value;
      }

      const parts = prev.split(/([+\-*/])/);
      const lastNumber = parts[parts.length - 1];
      
      if (!isNaN(value) || value === ".") {
        if (lastNumber.replace(".", "").length >= 15) {
          return prev;
        }
      }

      return prev + value;
    });
  };

  const calculateResult = () => {
    const evaluatedResult = evaluateExpression(expression);
    setResult(evaluatedResult);
    if (evaluatedResult !== null) {
      setHistory((prev) => [
        `${expression} = ${evaluatedResult}`,
        ...prev
      ]);
    }
  };

  const formatResult = (num) => {
    if (num === null) return "";
    const strNum = num.toString();
    if (strNum.includes(".")) {
      let [intPart, decPart] = strNum.split(".");
      decPart = decPart.slice(0, 10);
      let formatted = intPart + "." + decPart;
      if (formatted.length > 15) {
        formatted = formatted.slice(0, 15); 
      }
      return formatted;
    }
    return num.toString();
  };

  const handleKeyPress = (event) => {
    const key = event.key;
    if (/^[0-9+\-*/.]$/.test(key)) {
      setExpression((prev) => {
        if (/[+\-*/]$/.test(prev.slice(-1)) && /[+\-*/]/.test(key)) {
          return prev.slice(0, -1) + key;
        }
        
        const parts = prev.split(/([+\-*/])/);
        const lastNumber = parts[parts.length - 1];
        
        if (!isNaN(key) || key === ".") {
          if (lastNumber.replace(".", "").length >= 15) {
            return prev;
          }
        }

        return prev + key;
      });
    } else if (key === "Backspace") {
      setExpression((prev) => prev.slice(0, -1));
    } else if (key === "Escape") {
      setExpression("");
      setResult(null);
    } else if (key === "Enter") {
      if (!autoCalculate) {
        calculateResult();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [autoCalculate, expression]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calculatorHistory");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="relative flex flex-col items-center bg-black p-6 rounded-2xl shadow-xl w-full max-w-sm text-white">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="absolute left-[-40px] top-4 bg-gray-800 text-white p-3 rounded-full shadow-md"
        >
          <FaHistory />
        </button>

        <button
          data-testid="auto-calculate-button"
          onClick={() => setAutoCalculate(!autoCalculate)}
          className={`absolute left-[-40px] top-16 p-3 rounded-full shadow-md ${
            autoCalculate ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <FaSyncAlt />
        </button>

        <div className="w-full text-right bg-gray-200 p-3 rounded-lg mb-4 text-xl font-mono truncate text-black">
          {expression || "0"}
        </div>

        <div className="w-full text-right font-bold mb-4 p-2 bg-gray-200 rounded-lg overflow-auto break-words text-4xl max-h-20 text-black"
          style={{ wordWrap: "break-word", minHeight: "3rem" }}>
          {result !== null ? formatResult(result) : ""}
        </div>

        <div className="grid grid-cols-4 gap-2 w-full">
          <div className="grid grid-cols-3 gap-2 col-span-3">
            {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."].map((char) => (
              <button
                key={char}
                onClick={() => handleButtonClick(char)}
                className="p-4 bg-blue-500 text-white rounded-md text-xl hover:bg-blue-700 transition shadow-md"
              >
                {char}
              </button>
            ))}

            <button
              onClick={() => setExpression("")}
              className="p-4 bg-orange-700 text-white rounded-md text-xl hover:bg-orange-900 transition shadow-md"
            >
              C
            </button>
          </div>

          <div className="grid grid-rows-5 gap-1">
            {["/", "*", "-", "+", "="].map((char) => (
              <button
                key={char}
                onClick={() => (char === "=" ? calculateResult() : handleButtonClick(char))}
                className="p-3 bg-orange-500 text-white rounded-md text-lg hover:bg-orange-700 transition shadow-md"
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {showHistory && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-full bg-gray-800 text-white shadow-xl p-4 rounded-t-2xl max-h-[75%] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-2 border-b border-gray-600 pb-2">
              <h2 className="text-lg font-bold text-blue-400">Historial</h2>
              <button
                data-testid="Abrir Historial"
                onClick={() => setShowHistory(!showHistory)}
                className="absolute left-[-40px] top-4 bg-gray-800 text-white p-3 rounded-full shadow-md"
                aria-label="Abrir Historial"
              >
                <FaHistory />
              </button>
            </div>

            <ul className="text-sm text-white mt-2">
              {(showAllHistory ? history : history.slice(0, 10)).map((entry, index) => (
                <li key={index} className="py-1 border-b border-gray-600">{entry}</li>
              ))}
            </ul>
            {history.length > 10 && !showAllHistory && (
              <button onClick={() => setShowAllHistory(true)} className="mt-2 bg-gray-600 p-2 rounded-lg text-white text-sm w-full">Ver más</button>
            )}
            <button onClick={clearHistory} className="mt-2 bg-red-600 p-2 rounded-lg text-white text-sm w-full">
              <FaTrash className="inline mr-2" /> Borrar Historial
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
