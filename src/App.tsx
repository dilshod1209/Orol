import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeedbackForm } from './components/FeedbackForm';
import { AdminDashboard } from './components/AdminDashboard';
import { GenericListView } from './components/GenericListView';
import { AuthPage } from './components/AuthPage';
import { AralMap } from './components/AralMap';
import { useDataInitializer } from './hooks/useDataInitializer';

import { SectionSlider } from './components/SectionSlider';
import { db } from './lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  // Authorize by specific email for developer or by flag
  const isAdmin = user?.isAdmin === true || user?.email === 'dilshodallaberdiyev57@gmail.com' || (user?.phone === 'admin');
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  // Initialize sample data on first run
  useDataInitializer();

  const [featuredFlora, setFeaturedFlora] = React.useState<any[]>([]);
  const [featuredFauna, setFeaturedFauna] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      const floraSnap = await getDocs(query(collection(db, 'flora'), limit(10)));
      const faunaSnap = await getDocs(query(collection(db, 'fauna'), limit(10)));
      setFeaturedFlora(floraSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFeaturedFauna(faunaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchFeatured();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          
          <Route path="/" element={
            <>
              <Hero />
              {/* Home Stats section to match theme */}
               <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   {[
                     { label: 'Ma\'lumotlar', val: '1,248', desc: '+12 SQL Entries' },
                     { label: 'Fauna', val: '50+', desc: 'Hayvon turlari' },
                     { label: 'Flora', val: '50+', desc: 'O\'simlik turlari' },
                     { label: 'Tizim', val: 'Online', desc: 'Health: Stable' }
                   ].map((stat, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all cursor-default group">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest group-hover:text-emerald-500 transition-colors">{stat.label}</p>
                        <h3 className="text-4xl font-black mt-2 text-slate-900">{stat.val}</h3>
                        <p className="text-[10px] text-emerald-600 mt-2 font-mono italic">{stat.desc}</p>
                     </div>
                   ))}
                </div>
              </section>

              {featuredFlora.length > 0 && (
                <SectionSlider items={featuredFlora} title="Noyob Flora" />
              )}
              
              {featuredFauna.length > 0 && (
                <SectionSlider items={featuredFauna} title="Yovvoyi Fauna" />
              )}

              <AralMap />
            </>
          } />
          
          <Route path="/flora" element={
            <PrivateRoute>
              <GenericListView 
                collectionName="flora" 
                title="Flora Portal" 
                subtitle="Orol hududida o'sadigan va ekologik muvozanat uchun muhim o'simlik turlari."
              />
            </PrivateRoute>
          } />
          
          <Route path="/fauna" element={
            <PrivateRoute>
              <GenericListView 
                collectionName="fauna" 
                title="Fauna Directory" 
                subtitle="Dengiz qurishi natijasida yashash sharoiti o'zgargan noyob hayvonot dunyosi."
              />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute>
              <GenericListView 
                collectionName="history" 
                title="Chronicles" 
                subtitle="Orol dengizining 1960-yildan hozirgacha bo'lgan chuqur tahliliy tarixi."
              />
            </PrivateRoute>
          } />
          
          <Route path="/feedback" element={
            <PrivateRoute>
              <div className="max-w-4xl mx-auto px-4 py-24">
                <FeedbackForm />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/admin-panel" element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 py-20">
                 <AdminDashboard />
              </div>
            </AdminRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <footer className="bg-slate-900 border-t border-slate-800 py-20 mt-20 text-slate-500">
           <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">OE</div>
                <span className="text-xl font-bold text-white tracking-tight italic">Orol Eco Portal</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-slate-400">Architect Platform v2.4</p>
              <p className="text-sm opacity-50">&copy; 2026 Orol Eco Project. Barcha huquqlar himoyalangan.</p>
           </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
