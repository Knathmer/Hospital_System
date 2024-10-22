import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import IconLogoPatient from "./IconLogoPatient.jsx";

const NavbarPatient = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
      <nav className="mr-auto flex gap-4 sm:gap-6">
        <Link>
          <Menu className="h-8 w-8 text-pink-500"></Menu>
        </Link>
        <div className="px-8">
          <IconLogoPatient />
        </div>
      </nav>
    </header>
  );
};

export default NavbarPatient;
