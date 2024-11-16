import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconLogo from "../header/IconLogo";
import Navbar from "../header/Navbar";
import NavButton from "../../ui/buttons/NavButton";
import MainSection from "./sections/MainSection";
import Footer from "../../ui/Footer";
import GynecologyService from "./services/GynecologyService";
import ObstetricsService from "./services/ObstetricsService";
import WellnessService from "./services/WellnessService";
import Input from "../../ui/Input";

export default function WomensHealthLandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the token and login status from localStorage
    const token = localStorage.getItem("token");
    const currentLoginStatus = localStorage.getItem("Login");

    // Determine if a refresh is needed
    if (token && currentLoginStatus !== "true") {
      localStorage.setItem("Login", "true");
      window.location.reload();
    } else if (!token && currentLoginStatus !== "false") {
      localStorage.setItem("Login", "false");
      window.location.reload();
    }
  }, []); // Run only once on mount

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.setItem("Login", "false"); // Update Login status
    navigate("/login");
  };

  const navigateProfile = () => {
    // Get user role from token (assumes the role is stored in the token payload)
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const userRole = payload.role;

      switch (userRole) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "patient":
          navigate("/patient/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <IconLogo />
        <Navbar />
        <div className="flex items-center gap-4 ml-auto px-6">
          {localStorage.getItem("Login") === "true" ? (
            <>
              <NavButton className="text-sm" onClick={navigateProfile}>
                Profile
              </NavButton>
              <NavButton className="text-sm" onClick={handleLogout}>
                Log out
              </NavButton>
            </>
          ) : (
            <NavButton className="text-sm" onClick={() => navigate("/login")}>
              Log in
            </NavButton>
          )}
        </div>
      </header>
      <main className="flex-1">
        <MainSection />
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Our Services
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <GynecologyService />
            <ObstetricsService />
            <WellnessService />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-pink-100">
          <div className="flex items-center gap-6 lg:flex-cols-2 lg:gap-12 px-8 space-x-24 justify-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your Health, Our Priority
              </h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 max-w-2xl">
                At WomenWell, we understand that every woman's health journey is
                unique. Our team of expert healthcare professionals is dedicated
                to providing personalized care that addresses your individual
                needs and concerns.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <NavButton onClick={() => navigate("/consultation")}>
                Schedule a Consultation
              </NavButton>
              <NavButton variant="outline" onClick={() => navigate("/services")}>
                View Our Services
              </NavButton>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Stay Informed
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Subscribe to our newsletter for the latest updates on women's
                health, wellness tips, and exclusive offers.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2 justify-center">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <NavButton onClick={() => alert("Subscribed!")}>
                  Subscribe
                </NavButton>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By subscribing, you agree to our Terms & Conditions and Privacy
                Policy.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}