import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-10 pb-6 mt-8">
      <div className="daraz-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-4">Atom Drops</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/orders" className="hover:text-primary transition-colors">Track Your Order</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Return Policy</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h4 className="font-bold text-lg mb-4">Payment Method</h4>
            <div className="flex items-center gap-4">
              <div className="bg-[#e2136e] text-white px-4 py-2 rounded-md font-bold text-lg">
                bKash
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">We accept bKash payments only</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@atomdrops.com</li>
              <li>Phone: +880 1234-567890</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>© 2024 Atom Drops. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
