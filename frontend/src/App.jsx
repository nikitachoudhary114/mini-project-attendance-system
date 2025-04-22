import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  // Check if the current route is "/dashboard"
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      {isDashboard && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {isDashboard && <Footer />}
    </div>
  );
}

export default App;
