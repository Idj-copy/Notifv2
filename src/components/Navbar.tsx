import {NavLink} from 'react-router-dom';
import {CalendarIcon, Cog6ToothIcon, HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, UserIcon} from '@heroicons/react/24/outline';
import {isAuthenticated} from '../services/authService';

export default function Navbar() {
  const isAdmin = isAuthenticated();

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Sportify Now</h1>
          </div>
          <div className="flex space-x-4">
            <NavLink to="/" className={({ isActive }) => `nav-link flex items-center ${isActive ? 'active' : ''}`}>
              <HomeIcon className="w-5 h-5 mr-1" />
              Home
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `nav-link flex items-center ${isActive ? 'active' : ''}`}>
              <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
              Search
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => `nav-link flex items-center ${isActive ? 'active' : ''}`}>
              <CalendarIcon className="w-5 h-5 mr-1" />
              Calendar
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `nav-link flex items-center ${isActive ? 'active' : ''}`}>
              <Cog6ToothIcon className="w-5 h-5 mr-1" />
              Settings
            </NavLink>
            {isAdmin ? (
              <NavLink to="/admin" className={({ isActive }) => `nav-link flex items-center ${isActive ? 'active' : ''}`}>
                <PlusCircleIcon className="w-5 h-5 mr-1" />
                Add Event
              </NavLink>
            ) : (
              <NavLink to="/login" className="nav-link flex items-center opacity-50 hover:opacity-100">
                <UserIcon className="w-5 h-5" />
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
