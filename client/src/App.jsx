import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";

// Layout
import { Navbar } from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";

// Pages
import HomePages from "./pages/generic/home/HomePages";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// ===== Layout Wrapper =====
const Layout = () => (
  <div className="min-h-screen bg-black text-white mt-20">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ===== App with Routing =====
function App() {
  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Routes>
        {/*  Route useuse layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  Route not useuse layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePages />} />

          {/* 404 layout */}
          <Route
            path="*"
            element={
              <div className="text-center py-16 text-2xl">
                404 - Page Not Found
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
