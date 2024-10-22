import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import IconLogoPatient from "./iconLogoPatient.jsx";

const NavbarPatient = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
      <nav className="mr-auto flex gap-4 sm:gap-6">
        <Link>
          <Menu className="h-6 w-6 text-pink-500"></Menu>
        </Link>
      </nav>
      <IconLogoPatient />
    </header>
  );
};

export default NavbarPatient;
