import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Headers";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-800 via-indigo-900 to-blue-900 text-white">
      <Header />
      <AppRoutes />
    </div>
  );
}

export default App;