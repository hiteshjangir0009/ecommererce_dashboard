const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 md:flex md:items-center md:justify-between">
          {/* Left - Copyright */}
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Hitesh Jangir. All rights reserved.
          </div>
  
          {/* Center - Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/about" className="text-gray-400 hover:text-white">
              About
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
          </div>
  
          {/* Right - Social Icons */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  