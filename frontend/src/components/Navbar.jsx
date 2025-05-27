import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, User, Settings, BookmarkCheck, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import logo from "../assets/logo.svg";
import defaultAvatar from "../assets/avatar.svg"; // fallback if user hasn't uploaded profile pic

const Navbar = ({ isAuthenticated = false, user = {}, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const navLinks = [
    { label: "Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Salaries", href: "/salaries" },
    { label: "Blogs", href: "/blogs" },
  ];

  return (
    <header className="fixed top-0 w-full px-4 h-16 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="hidden md:inline text-xl font-bold text-indigo-600 dark:text-emerald-400">RojgarData</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="hover:text-indigo-600 cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {/* <button
            onClick={toggleTheme}
            className="hover:text-indigo-600 text-gray-700 dark:text-gray-300 transition"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button> */}
          {/* <i onClick={toggleTheme} className={`cursor-pointer ${darkMode ? "text-indigo-600" : "text-gray-700 dark:text-gray-300"} transition`}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </i> */}

          {/* Profile / Sign In */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={user?.avatar || defaultAvatar}
                  alt="User"
                  className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 dark:border-gray-700"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-medium">{user.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link className="text-gray-600" to="/profile">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link className="text-gray-600" to="/saved">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </DropdownMenuItem>
                </Link>
                <Link className="text-gray-600" to="/settings">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                {/* <DropdownMenuItem onClick={toggleTheme} className="flex items-center gap-2">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={onLogout} className="text-red-600 hover:bg-red-50">
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block hover:text-indigo-600 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
