/*
 * The axios library is used to make HTTP requests from the browser.
 * In this code, it is used to fetch data from an API endpoint.
*/
import { useState, useEffect } from 'react' 
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import axios from "axios"; 

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  
  const fetchAPI = async() => { 
    const response = await axios.get("http://localhost:3000/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <div>
        
          <img src={viteLogo} className="logo" alt="Vite logo" />
          <img src={reactLogo} className="logo react" alt="React logo" />

      </div>
      <h1>I am testing</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          I am fetching the fruits from the backend using an API
        </p>
        { array.map((fruit, index) =>  (
            <div key={index}>
              <p>{fruit}</p>
              <br></br>
            </div>
        ))}
      </div>
      <p className="read-the-docs">
        I removed the links in the logos
      </p>
    </>
  )
}

export default App
