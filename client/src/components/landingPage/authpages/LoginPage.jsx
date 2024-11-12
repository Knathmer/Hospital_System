//import Button from "../ui/button";

import Label from "../../ui/Label";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from 'jwt-decode';
import NavButton from "../../ui/buttons/NavButton";
import Input from "../../ui/Input";

const LoginPage = () => {
  //Hooks(Event handler) (For dyanmically updating site)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Store the JWT token and user role in the browser
        localStorage.setItem("token", response.data.token);

        const decodedToken = jwt_decode(response.data.token);
        const userRole = decodedToken.role;

        // Redirect based on user role
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "doctor") {
          navigate("/doctor/dashboard?tab=dashboard");
        } else if (userRole === "patient") {
          navigate("/patient/dashboard?tab=dashboard");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link
          className="flex items-center justify-center"
          to="/WomensHealthLandingPage"
        >
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="ml-2 text-2xl font-bold text-gray-900">
            WomenWell
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 px-3 py-2 border rounded-md w-full shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 px-3 py-2 border rounded-md w-full shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </Label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <NavButton
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md shadow-lg transition duration-200 ease-in-out"
            >
              Sign in
            </NavButton>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center border-t bg-white">
        <p className="text-sm text-gray-500">
          © 2024 WomenWell. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
