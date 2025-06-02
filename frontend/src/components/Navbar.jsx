import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Moon, Sun, Menu, X, User, Settings, BookmarkCheck, LogOut
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import logo from "../assets/logo.svg";
import defaultAvatar from "../assets/avatar.svg";

const Navbar = ({ isAuthenticated, user = {}, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Salaries", href: "/salaries" },
    { label: "Blogs", href: "/blogs" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-24">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:no-underline">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="hidden text-xl font-bold text-indigo-600 dark:text-emerald-400 md:inline">
            RojgarData
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className="hover:text-indigo-600 transition-colors hover:no-underline"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Authenticated User */}
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
                <DropdownMenuLabel className="font-medium">
                  {user.name || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link to="/saved">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
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

          {/* Mobile Nav Toggle */}
          <div
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer text-gray-700 dark:text-gray-300 md:hidden"
            role="button"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 pt-2 text-sm text-gray-700 dark:text-gray-200 shadow">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className="block py-2 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
