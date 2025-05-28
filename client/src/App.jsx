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

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "~/pages/Auth/Login";
import Register from "~/pages/Auth/Register";
import ForgotPassword from "~/pages/Auth/ForgotPassword";
import { Navbar } from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";
import { Hero } from "./components/hero/hero";
import { Services } from "./components/services/Services";
import { WorkProcess } from "./components/workProcess/WorkProcess";
import { Pricing } from "./components/pricing/Pricing";
import { ContactForm } from "./components/contactForm/ContactForm";
import { Testimonials } from "./components/testimonials/Testimonials";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white mt-20">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Hero />
        <Services />
        <WorkProcess />
        <Pricing />
        <ContactForm />
        <Testimonials />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Layout>
        <ForgotPassword />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;

}

export default App;
