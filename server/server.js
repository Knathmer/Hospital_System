import express from "express";
import cors from "cors"; // Use import instead of require
import bodyParser from "body-parser";
import fruitRouter from "./routers/edibles.js";
import authRouter from "./routers/auth.js";

const app = express();

// Connection restrictions
const corsOptions = { 
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    credentials: true, // Allow sending cookies and authentication tokens (if needed)
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Using CORS middleware with the defined options

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/edibles", fruitRouter);
app.use("/auth", authRouter);

// Start the server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
