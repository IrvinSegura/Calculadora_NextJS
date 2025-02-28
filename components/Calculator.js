"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaSyncAlt, FaTrash } from "react-icons/fa";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(false); // Desactivado por defecto

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
      return eval(expr);
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
      return prev + value;
    });
  };

  const calculateResult = () => {
    const evaluatedResult = evaluateExpression(expression);
    setResult(evaluatedResult);
    if (evaluatedResult !== null) {
      setHistory((prev) => [...prev, `${expression} = ${evaluatedResult}`].slice(-10));
    }
  };

  const handleKeyPress = (event) => {
    const key = event.key;
    if (/^[0-9+\-*/]$/.test(key)) {
      setExpression((prev) => {
        if (/[+\-*/]$/.test(prev.slice(-1)) && /[+\-*/]/.test(key)) {
          return prev.slice(0, -1) + key;
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
    <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
      <div className="relative flex flex-col items-center bg-gray-100 p-6 rounded-2xl shadow-xl w-80">
        {/* Botón de historial */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="absolute left-[-40px] top-4 bg-gray-800 text-white p-3 rounded-full shadow-md"
        >
          <FaHistory />
        </button>

        {/* Botón de cálculo automático (debajo del historial) */}
        <button
          onClick={() => setAutoCalculate(!autoCalculate)}
          className={`absolute left-[-40px] top-16 p-3 rounded-full shadow-md ${
            autoCalculate ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <FaSyncAlt />
        </button>

        {/* Pantalla de expresión */}
        <div className="w-full text-right bg-gray-200 p-3 rounded-lg mb-4 text-xl font-mono">
          {expression || "0"}
        </div>

        {/* Pantalla de resultado */}
        <div className="w-full text-right text-4xl font-bold mb-4">
          {result !== null ? result : ""}
        </div>

        {/* Botones */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "+", "="].map(
            (char) => (
              <button
                key={char}
                onClick={() => {
                  if (char === "C") {
                    setExpression("");
                    setResult(null);
                  } else if (char === "=") {
                    if (!autoCalculate) {
                      calculateResult();
                    }
                  } else {
                    handleButtonClick(char);
                  }
                }}
                className="p-4 bg-blue-500 text-white rounded-lg text-xl hover:bg-blue-700 transition shadow-md"
              >
                {char}
              </button>
            )
          )}
        </div>

        {/* Historial (se muestra solo cuando lo abres) */}
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
                onClick={() => setShowHistory(false)}
                className="bg-gray-700 p-2 rounded-full text-white text-sm"
              >
                ✕
              </button>
            </div>
            <ul className="text-sm text-white mt-2">
              {history.length > 0 ? (
                history.map((entry, index) => <li key={index} className="py-1 border-b border-gray-600">{entry}</li>)
              ) : (
                <li className="text-gray-400">Vacío</li>
              )}
            </ul>
            <button
              onClick={clearHistory}
              className="mt-2 bg-red-600 p-2 rounded-lg text-white text-sm w-full"
            >
              <FaTrash className="inline mr-2" /> Borrar Historial
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
