import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QuestionData from "./pages/QuestionData";
import AttendanceTable from "./pages/AttendanceTable";

function App() {
  const location = useLocation();

  // Check if the current route requires Navbar and Footer
  const showNavbarAndFooter = ["/dashboard", "/question-data", "/attendance-data"].includes(
    location.pathname
  );

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbarAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/question-data" element={<QuestionData />} />
          <Route path="/attendance-data" element={<AttendanceTable />} />
        </Routes>
      </main>
      {showNavbarAndFooter && <Footer />}
    </div>
  );
}

export default App;
