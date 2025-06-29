import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Headers";
import { setInitialTheme } from "./utils/theme";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  useEffect(() => {
    setInitialTheme();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <ToastContainer position="top-center" />
        <Header />
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}

export default App;