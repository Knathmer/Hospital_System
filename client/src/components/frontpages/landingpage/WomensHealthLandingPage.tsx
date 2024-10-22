import React from "react";
import { Link } from "react-router-dom";
import { Heart, Users, Calendar, Phone } from "lucide-react";
import IconLogo from "../header/iconLogo";
import Navbar from "../header/navbar";
import NavButton from "../../ui/buttons/navButton";
import MainSection from "./sections/MainSection";
import Input from "../../ui/input";
import Footer from "../../ui/footer";
import GynecologyService from "./services/gynecologyService";
import ObstetricsService from "./services/obstetricsService";
import WellnessService from "./services/wellnessService";

export default function WomensHealthLandingPage() {
  return (
    <div className="flex flex-col min-h-screen min-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <IconLogo />
        <Navbar />
        <div className="px-6">
          <NavButton className="text-sm" to="/login">
            Log in
          </NavButton>
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
              <NavButton>Schedule a Consultation</NavButton>
              <NavButton variant="outline">View Our Services</NavButton>
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
                <NavButton>Subscribe</NavButton>
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
