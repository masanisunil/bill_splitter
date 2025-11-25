import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import { ThemeContext } from "./ThemeContext";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <BrowserRouter>
        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 w-full flex justify-between items-center px-4 sm:px-6 py-4 shadow-md bg-white dark:bg-gray-800 dark:text-white">
          
          {/* Logo + Home Link */}
          <Link to="/" className="text-xl sm:text-2xl font-bold">
            Split Bill
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="px-3 sm:px-4 py-2 rounded-lg bg-blue-600 dark:bg-yellow-500 text-white dark:text-black shadow text-sm sm:text-base"
          >
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
