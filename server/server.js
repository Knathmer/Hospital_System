
// Use <npm run dev> in the console to run the server in dev mode which allows the front end to constantly be updated as there are changes made to the back end (this is done with nodemon)
const fruitRouter = require("./routers/edibles.js");
const express = require("express");
const app = express();

// CORS (Cross-Origin Resource Sharing) is a security feature implemented by browsers to restrict web pages from making requests to a different domain than the one that served the web page. 
// This configuration allows the server to accept requests from the specified origin (http://localhost:5173) only.
const cors = require("cors"); 
const corsOptions = { 
    origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));


app.use("/edibles", fruitRouter);

app.listen(3000, () => {
    console.log("Server started on port 3000");  
});