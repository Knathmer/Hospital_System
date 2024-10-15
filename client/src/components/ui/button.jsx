import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({children, variant='default', className='', to=''}) => {
  const nav = useNavigate();

  const handleClick = () => {
      nav(to);
  };
  return (
    <button className={variant == "outline" ? `bg-white font-medium px-4 py-2 hover:bg-gray-100 rounded-md inline-block ${className}`: 
      `bg-pink-500 text-white font-medium px-4 py-2 hover:bg-pink-600 rounded-md inline-block ${className}`}
            onClick={handleClick}
            > 
            
            {children} 
            
    </button>
  );
};

export default Button