import React from "react";
import NavButton from "../../../ui/buttons/navButton";

const MainSection = () => {
  return (
    <section className="min-w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-pink-50">
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
          <NavButton to="/book">Book Appointment</NavButton>
          <NavButton variant="outline">Learn More</NavButton>
        </div>
      </div>
    </section>
  );
};

export default MainSection;
