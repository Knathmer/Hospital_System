import React from "react";
import { Link } from "react-router-dom";
import { Heart, Users, Calendar, Phone } from "lucide-react";
import Button from "../ui/button";
import Input from "../ui/input";
import Footer from "../ui/footer";
import IconLogo from "../ui/iconLogo";
import Navbar from "../ui/navbar";
import MainSection from "../ui/landingpage/sections/mainSection";
import GynecologyService from "../ui/landingpage/services/gynecologyService";
import ObstetricsService from "../ui/landingpage/services/obstetricsService";
import WellnessService from "../ui/landingpage/services/wellnessService";

export default function WomensHealthLandingPage() {
  return (
    <div className="flex flex-col min-h-screen min-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <IconLogo />
        <Navbar />
        <div className="px-6">
          <Button className="text-sm" to="/login">
            Log in
          </Button>
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
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 px-6 justify-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your Health, Our Priority
              </h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                At WomenWell, we understand that every woman's health journey is
                unique. Our team of expert healthcare professionals is dedicated
                to providing personalized care that addresses your individual
                needs and concerns.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button>Schedule a Consultation</Button>
              <Button variant="outline">View Our Services</Button>
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
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button>Subscribe</Button>
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
