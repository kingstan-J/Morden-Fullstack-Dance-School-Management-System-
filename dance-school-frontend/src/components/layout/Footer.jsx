import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMusic } from 'react-icons/fi';

const Footer = () => (
  <footer className="border-t border-white/10 bg-black/30 mt-20">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <FiMusic className="text-white" size={18} />
            </div>
            <span className="font-bold text-xl gradient-text">Drizzle Dance</span>
          </Link>
          <p className="text-gray-400 text-sm mb-4">Where every step tells a story. Professional dance training for all ages and levels.</p>
          <div className="flex gap-3">
            {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[['/', 'Home'], ['/about', 'About Us'], ['/courses', 'Courses'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} className="text-gray-400 hover:text-purple-400 text-sm transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <div className="flex flex-col gap-2">
            {[['/privacy', 'Privacy Policy'], ['/terms', 'Terms & Conditions']].map(([to, label]) => (
              <Link key={to} to={to} className="text-gray-400 hover:text-purple-400 text-sm transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-400 text-sm"><FiMail size={14} className="text-purple-400" /> info@drizzledance.com</div>
            <div className="flex items-center gap-2 text-gray-400 text-sm"><FiPhone size={14} className="text-purple-400" /> +91 98765 43210</div>
            <div className="flex items-center gap-2 text-gray-400 text-sm"><FiMapPin size={14} className="text-purple-400" /> 42, Dance Avenue, Chennai</div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Drizzle Dance Academy. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
