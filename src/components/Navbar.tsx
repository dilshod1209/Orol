import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, LogOut, Shield, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const isAdmin = user?.isAdmin === true || user?.email === 'dilshodallaberdiyev57@gmail.com' || user?.phone === 'admin';

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'O\'simliklar', path: '/flora' },
    { name: 'Hayvonot', path: '/fauna' },
    { name: 'Tarix', path: '/history' },
    { name: 'Takliflar', path: '/feedback' },
  ];

  return (
    <nav className="bg-slate-900 text-slate-300 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">OE</div>
            <span className="text-lg font-bold text-white tracking-tight italic">Orol Eco Portal</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin-panel"
                className="flex items-center space-x-1 text-emerald-500 hover:text-white font-bold transition-colors text-xs uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-md"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            <div className="h-4 w-px bg-slate-800 mx-2" />

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-bold text-white leading-none">{user.phone}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{isAdmin ? 'Administrator' : 'Foydalanuvchi'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                  title="Chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 transition-all text-xs uppercase tracking-widest"
              >
                Kirish
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-slate-400 hover:bg-slate-800 hover:text-white text-xs font-bold uppercase tracking-widest rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin-panel"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-emerald-500 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 rounded-lg"
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-4 mt-4 border-t border-slate-800">
                {!user ? (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest"
                  >
                    Kirish
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest"
                  >
                    Chiqish
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

