//Database fetches are made in controllers

const ediblecontroller = {};

ediblecontroller.fruitRequest = (req, res, next) => {
    res.locals.fruit = {fruits: ["apple", "orange", "banana"]}
    return next(); //Makes sure that the next middleware function is called when there are multiple assigned
}


export default ediblecontroller;