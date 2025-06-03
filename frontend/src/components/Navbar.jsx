import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Moon, Sun, Menu, X, User, Settings, BookmarkCheck, LogOut
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu';
import logo from '../assets/logo.svg';
import defaultAvatar from '../assets/avatar.svg';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Companies', href: '/companies' },
  { label: 'Salaries', href: '/salaries' },
  { label: 'Blogs', href: '/blogs' }
];

const userLinks = [
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Saved', icon: BookmarkCheck, path: '/saved' },
  { label: 'Settings', icon: Settings, path: '/settings' }
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setMobileMenuOpen(prev => !prev);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // Ensure theme respects localStorage on load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  // Wait until auth is resolved
  if (isAuthenticated === null) return null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-24">
        <Link to="/" className="flex items-center gap-2 hover:no-underline">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="hidden text-xl font-bold text-indigo-600 dark:text-emerald-400 md:inline">
            RojgarData
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          {navLinks.map(({ label, href }) => (
            <NavLink key={href} to={href} className="hover:text-indigo-600 transition-colors hover:no-underline">
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="bg-transparent text-gray-600 dark:text-gray-300 hover:bg-transparent">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Authenticated menu or Sign In */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={user?.avatar || defaultAvatar}
                  alt="User Avatar"
                  className="h-8 w-8 cursor-pointer rounded-full border border-gray-300 dark:border-gray-700"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userLinks.map(({ label, icon: Icon, path }) => (
                  <Link to={path} key={path}>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600">
              <User className="h-5 w-5" />
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <div
            onClick={toggleMenu}
            className="cursor-pointer text-gray-700 dark:text-gray-300 md:hidden"
            role="button"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 pt-2 text-sm text-gray-700 dark:text-gray-200 shadow">
          {navLinks.map(({ label, href }) => (
            <NavLink
              key={href}
              to={href}
              className="block py-2 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
