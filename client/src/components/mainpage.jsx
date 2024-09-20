import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import '../App.css'
import { useNavigate } from 'react-router-dom'; //For routing to different paths

export default function Home({ count, setCount, array}){
    const navigate = useNavigate();

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
        <p>I am fetching the fruits from the backend using an API</p>
        {array.map((fruit, index) => (
          <div key={index}>
            <p>{fruit}</p>
            <br />
          </div>
        ))}
      </div>
      <button className="foodStore" onClick={() => navigate('/FoodStore')}>
        Click for Food Store!
      </button>
    </>
  );

}