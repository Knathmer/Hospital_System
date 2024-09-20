/*
 * The axios library is used to make HTTP requests from the browser.
 * In this code, it is used to fetch data from an API endpoint.
*/

import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react' //useEffect for fetching data and stuff, useState allows the "state" of the page to reflect whatever you define it to.
import axios from "axios"; 
import Home from './mainpage.jsx'
import FoodStore from './foodstore.jsx'

function App() {
  //Const here just makes it so the variable identifier cannot be reassigned, not that the value cannot change.
  const [count, setCount] = useState(0); //Initial state of count set to 0, but is rerendered when setCount is called
  const [array, setArray] = useState([]); //Initial state of array to empty array. Same applies as above.
  
  const fetchAPI = async() => { 
    const response = await axios.get("http://localhost:3000/edibles/fruits");
    setArray(response.data.fruits); // State is updated
  };

  useEffect(() => { //As soon as this component is rendered this will run
    fetchAPI();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home count={count} setCount={setCount} array={array} />} />
      <Route path="/FoodStore" element={<FoodStore />} />
    </Routes>
  )
}

export default App
