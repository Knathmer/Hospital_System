// This file shows the logo and brand on the sidebar
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function LogoSidebar() {
  return (
    <Link to="/" className="flex items-center">
      <Heart className="h-6 w-6 text-pink-500" />
      <span className="ml-2 text-xl font-bold text-gray-900">WomenWell</span>
    </Link>
  );
}
