import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import { ThemeContext } from "./ThemeContext";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen transition duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <BrowserRouter>
        {/* NAVBAR  */}
        <div className="w-full flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-gray-800 dark:text-white">
          <h1 className="text-2xl font-bold">Split Bill</h1>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-yellow-500 text-white dark:text-black shadow"
          >
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
