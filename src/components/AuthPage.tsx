import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Smartphone, Lock, UserPlus, LogIn, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Special case for admin
        if (phone === 'admin' && password === 'admin') {
          localStorage.setItem('user', JSON.stringify({ phone: 'admin', isAdmin: true }));
          navigate('/admin-panel');
          window.location.reload(); 
          return;
        }

        // Normal user login
        const q = query(collection(db, 'users'), where('phone', '==', phone), where('password', '==', password));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setError('Nomer yoki parol noto\'g\'ri');
        } else {
          const userData = snapshot.docs[0].data();
          localStorage.setItem('user', JSON.stringify({ phone, isAdmin: userData.isAdmin || false }));
          navigate('/');
          window.location.reload();
        }
      } else {
        // Register
        // First check if user exists
        const qExist = query(collection(db, 'users'), where('phone', '==', phone));
        const snapshotExist = await getDocs(qExist);
        
        if (!snapshotExist.empty) {
          setError('Ushbu raqam allaqachon ro\'yxatdan o\'tgan');
        } else {
          await addDoc(collection(db, 'users'), {
            phone,
            password,
            isAdmin: false,
            createdAt: new Date().toISOString()
          });
          setIsLogin(true);
          setError('Muvaffaqiyatli ro\'yxatdan o\'tdingiz. Endi kiring.');
        }
      }
    } catch (err) {
      setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="bg-slate-900 p-8 text-white text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
            {isLogin ? <LogIn className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
          </div>
          <h2 className="text-3xl font-bold italic">Orol Eco Portal</h2>
          <p className="text-slate-400 text-sm mt-2">
            {isLogin ? 'Tizimga kirish' : 'Ro\'yxatdan o\'tish'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center ${error.includes('Muvaffaqiyatli') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Telefon raqam yoki Login</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Telefon raqamingiz"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Parol</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="********"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {isLogin && (
            <div className="pt-2">
              <button 
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  // Direct admin login
                  localStorage.setItem('user', JSON.stringify({ phone: 'admin', isAdmin: true }));
                  navigate('/admin-panel');
                  window.location.reload();
                }}
                className="w-full border-2 border-dashed border-slate-200 text-slate-400 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-emerald-300 hover:text-emerald-600 transition-all font-mono"
              >
                Tezkor Kirish (Demo Admin)
              </button>
            </div>
          )}

          <div className="text-center pt-4">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              {isLogin ? 'Hisobingiz yo\'qmi? Ro\'yxatdan o\'ting' : 'Hisobingiz bormi? Kirish'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
