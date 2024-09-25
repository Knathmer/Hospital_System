const express = require("express");
const ediblecontroller = require('../controllers/ediblecontroller.js')

const router = express.Router();

router.get("/fruits", ediblecontroller.fruitRequest ,(req, res) => {
    // console.log(toaster['fruits']);
    // console.log(toaster.fruits); 
    console.log(res);
    return res.json(res.locals.fruit);
});

module.exports = router;