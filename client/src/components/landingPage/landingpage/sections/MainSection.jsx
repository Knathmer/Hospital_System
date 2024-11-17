import React from "react";
import NavButton from "../../../ui/buttons/NavButton";

const MainSection = () => {
  return (
    <section
      className="min-w-full py-16 md:py-32 lg:py-48 xl:py-64 relative bg-pink-50"
      style={{
        backgroundImage: `url('https://mountainsidemedicalcenter.com/wp-content/uploads/sites/6/2024/07/GettyImages-489301270.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Faded Pink Overlay */}
      <div
        className="absolute inset-0 bg-pink-100 opacity-50"
        aria-hidden="true"
      ></div>
      {/* Content */}
      <div className="relative flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Empowering Women's Health
          </h1>
          <p className="mx-auto max-w-[700px] text-black-500 md:text-xl dark:text-black-400 py-6">
            Comprehensive care for every stage of a woman's life. Expert
            guidance, compassionate support, and cutting-edge treatments.
          </p>
        </div>
        <div className="space-x-4">
          <NavButton to="/patient/dashboard?tab=appointments">
            Book Appointment
          </NavButton>
          <NavButton variant="outline">Learn More</NavButton>
        </div>
      </div>
    </section>
  );
};

export default MainSection;
