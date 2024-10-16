import React from "react";
import { Link } from "react-router-dom";
import { Heart, Users, Calendar, Phone } from "lucide-react";
import Button from "../ui/button";
import Input from "../ui/input";
import Footer from "../ui/footer";
import IconLogo from "../ui/iconLogo";
import Navbar from "../ui/navbar";

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
        <section className="min-w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-pink-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Empowering Women's Health
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 py-6">
                  Comprehensive care for every stage of a woman's life. Expert
                  guidance, compassionate support, and cutting-edge treatments.
                </p>
              </div>
              <div className="space-x-4">
                <Button to="/book">Book Appointment</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Our Services
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Gynecology</h3>
                <p className="text-gray-500">
                  Comprehensive care for all your gynecological needs.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Calendar className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Obstetrics</h3>
                <p className="text-gray-500">
                  Expert care throughout your pregnancy journey.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Wellness</h3>
                <p className="text-gray-500">
                  Holistic approaches to women's health and well-being.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-pink-100">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Your Health, Our Priority
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  At WomenWell, we understand that every woman's health journey
                  is unique. Our team of expert healthcare professionals is
                  dedicated to providing personalized care that addresses your
                  individual needs and concerns.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
                <Button>Schedule a Consultation</Button>
                <Button variant="outline">View Our Services</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
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
                  By subscribing, you agree to our Terms & Conditions and
                  Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
