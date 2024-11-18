import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Pulls the secret key from .env

// Middleware for ensuring that user has 'some' JWT (This is not role-based)
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid Token!");
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    // Attach user info to the request object
    req.user = decoded;
    next();
  });
};

//Make sure that the roles match
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }
    next();
  };
};

export const verifyTokenTemp = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Invalid Token:", err.message);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    console.log("Decoded Token Payload:", decoded);

    // Attach role-specific user ID to the request object
    if (decoded.role === "patient") {
      req.user = { id: decoded.patientID, role: decoded.role };
    } else if (decoded.role === "doctor") {
      req.user = { id: decoded.doctorID, role: decoded.role };
    } else if (decoded.role === "admin") {
      req.user = { id: decoded.adminID, role: decoded.role };
    } else {
      return res.status(400).json({ message: "Unknown user role in token" });
    }

    next();
  });
};
