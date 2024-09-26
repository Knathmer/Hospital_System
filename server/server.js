const fruitRouter = require("./routers/edibles.js");
const authRouter = require('./routers/auth.js');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();


//Connection restrictions
const cors = require("cors"); 
const corsOptions = { 
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    credentials: true, // Allow sending cookies and authentication tokens (if needed)
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));


//Middleware
app.use(bodyParser.json());


//Routes
app.use("/edibles", fruitRouter);

app.use("/auth", authRouter);



//Start the server
app.listen(3000, () => {
    console.log("Server started on port 3000");  
});

