import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="ml-auto flex gap-4 sm:gap-6">
      <Link
        className="text-sm font-medium hover:underline underline-offset-8 decoration-pink-500"
        to="#"
      >
        Services
      </Link>
      <Link
        className="text-sm font-medium hover:underline underline-offset-8 decoration-pink-500"
        to="/about"
      >
        About Us
      </Link>
      <Link
        className="text-sm font-medium hover:underline underline-offset-8 decoration-pink-500"
        to="#"
      >
        Resources
      </Link>
      <Link
        className="text-sm font-medium hover:underline underline-offset-8 decoration-pink-500"
        to="#"
      >
        Contact
      </Link>
    </nav>
  );
};

export default Navbar;
