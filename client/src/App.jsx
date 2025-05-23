import React from "react";
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
