import logo from "../assets/logo.svg";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800">
      <div className="mx-auto px-4 md:px-12 lg:px-24 pb-10 md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Logo and Address */}
        <div>
          <div className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><img src={logo} alt="Logo" className="w-8 h-8 dark:invert" />RojgarData</div>
          <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">Where Career Meets Transparency.</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            123 Main Street<br />
            Kathmandu, Nepal<br />
            +977-1-1234567
          </p>
        </div>

        {/* Column 2: Company Links */}
        <div>
          <h4 className="font-semibold text-base mb-2">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-gray-600 dark:text-gray-400" to="/about">About</Link></li>
            <li><Link className="text-gray-600 dark:text-gray-400" to="/contact">Contact</Link></li>
            <li><Link className="text-gray-600 dark:text-gray-400" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="text-gray-600 dark:text-gray-400" to="/terms">Terms of Service</Link></li>
            <li><Link className="text-gray-600 dark:text-gray-400" to="/advertise">Advertise</Link></li>
          </ul>
        </div>

        {/* Column 3: For Employers */}
        <div>
          <h4 className="font-semibold text-base mb-2">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-gray-600 dark:text-gray-400" to="/employer/register">Employer Register</Link></li>
            <li><Link className="text-gray-600 dark:text-gray-400" to="/employers/jobs">Manage Jobs</Link></li>
            <li><Link className="text-gray-600 dark:text-gray-400" to="/pricing">Pricing</Link></li>
            <li><Link className="text-gray-600 dark:text-gray-400" to="/support">Support</Link></li>
          </ul>
        </div>

        {/* Column 4: Social Media */}
        <div>
          <h4 className="font-semibold text-base mb-2">Follow Us</h4>
          <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
            <a href="http://www.facebook.com/rojgardata.np" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
            {/* <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5" /></a> */}
            <a href="https://www.linkedin.com/company/rojgardata" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
            {/* <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5" /></a> */}
          </div>
        </div>
      </div>
      <div className="border-t text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} RojgarData. All rights reserved. Made with &#10084; by <a href="https://madan.codes" className="text-primary">Madan Neupane</a>.
      </div>
    </footer>
  );
}

export default Footer