import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, deleteDoc, query, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Feedback, Flora, Fauna, HistoryItem } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorHandler';
import { Trash2, Sprout, PawPrint, ScrollText, MessageSquare, Plus, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { seedDatabase } from '../lib/seedData';

export const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'flora' | 'fauna' | 'history' | 'feedback'>('feedback');
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm('Bu barcha bo\'limlarga 20 tadan namunaviy ma\'lumotlarni qo\'shadi. Davom etasizmi?')) return;
    setSeeding(true);
    const success = await seedDatabase();
    setSeeding(false);
    if (success) {
      alert('Ma\'lumotlar muvaffaqiyatli yuklandi!');
      window.location.reload();
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Feedback));
      setFeedbacks(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'feedback');
    });

    return () => unsubscribe();
  }, []);

  const deleteFeedback = async (id: string) => {
    if (!window.confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;
    try {
      await deleteDoc(doc(db, 'feedback', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `feedback/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🌍</span>
          <h1 className="text-4xl font-extrabold text-emerald-700 tracking-tight">Ferdo Admin</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="px-6 py-3 bg-white border border-emerald-200 text-emerald-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all disabled:opacity-50"
          >
            {seeding ? 'Yuklanmoqda...' : 'Demo Ma\'lumotlar'}
          </button>
          <Link 
            to="/" 
            className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-xs uppercase tracking-widest"
          >
            Saytni ko'rish
          </Link>
        </div>
      </div>

      {/* Tabs / Navigation */}
      <div className="bg-white rounded-3xl p-3 flex flex-wrap shadow-sm border border-slate-100 gap-2">
        <TabButton 
          active={activeTab === 'flora'} 
          onClick={() => setActiveTab('flora')} 
          icon={<Sprout className="w-5 h-5 text-emerald-600" />} 
          label="Flora" 
        />
        <TabButton 
          active={activeTab === 'fauna'} 
          onClick={() => setActiveTab('fauna')} 
          icon={<PawPrint className="w-5 h-5 text-slate-600" />} 
          label="Fauna" 
        />
        <TabButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<ScrollText className="w-5 h-5 text-amber-600" />} 
          label="Tarix" 
        />
        <div className="flex-grow" />
        <button 
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all ${
            activeTab === 'feedback' 
            ? 'bg-emerald-700 text-white shadow-xl shadow-emerald-700/20' 
            : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Takliflar ({feedbacks.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {activeTab === 'feedback' ? (
          <div className="p-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 italic text-slate-400">
                  <th className="pb-6 font-semibold px-4">Kimdan</th>
                  <th className="pb-6 font-semibold px-4">Xabar</th>
                  <th className="pb-6 font-semibold px-4">Vaqt</th>
                  <th className="pb-6 font-semibold px-4">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 font-medium italic">
                      Hozircha takliflar mavjud emas.
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((fb) => (
                    <tr key={fb.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-6 px-4 font-bold text-emerald-600">
                        {fb.name || fb.email || 'Noma\'lum'}
                      </td>
                      <td className="py-6 px-4 text-slate-600 text-sm max-w-md">
                        {fb.message}
                      </td>
                      <td className="py-6 px-4 text-slate-400 text-xs font-mono">
                        {fb.createdAt?.toDate?.() ? fb.createdAt.toDate().toLocaleString('sv-SE').replace('T', ' ') : 'Just now'}
                      </td>
                      <td className="py-6 px-4">
                        <button 
                          onClick={() => deleteFeedback(fb.id!)}
                          className="px-6 py-2 border border-red-200 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <ContentManager section={activeTab} />
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
      active 
      ? 'bg-slate-50 text-emerald-700' 
      : 'text-slate-500 hover:bg-slate-50/50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ContentManager = ({ section }: { section: 'flora' | 'fauna' | 'history' }) => {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const q = collection(db, section);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [section]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const { id, ...data } = formData;
      const timestampedData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, section, editingId), timestampedData);
      } else {
        timestampedData.createdAt = serverTimestamp() as any;
        await addDoc(collection(db, section), timestampedData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
    } catch (error: any) {
      console.error("Save error:", error);
      setSaveError(error.message || "Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('O\'chirmoqchimisiz?')) return;
    try {
      await deleteDoc(doc(db, section, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${section}/${id}`);
    }
  };

  const startEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(true);
  };

  return (
    <div className="p-8">
      {!isAdding ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 capitalize">{section} Ma'lumotlar</h2>
            <button 
              onClick={() => { setFormData({}); setIsAdding(true); setEditingId(null); }}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi qo'shish</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-500/50 transition-all group">
                <div className="flex items-center gap-4">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  )}
                  <span className="font-extrabold text-slate-800">{item.name || item.title}</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => startEdit(item)} className="text-xs font-bold text-emerald-600 hover:underline">Tahrirlash</button>
                  <button onClick={() => deleteItem(item.id)} className="text-xs font-bold text-red-400 hover:underline">O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-10">
          <h2 className="text-3xl font-black mb-8 text-slate-900">{editingId ? 'Tahrirlash' : 'Yangi qo\'shish'}</h2>
          {saveError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
              {saveError}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nom / Sarlavha</label>
                <input 
                  required
                  value={formData.name || formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, [section === 'history' ? 'title' : 'name']: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors"
                />
             </div>
             {section === 'history' && (
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Vaqt Davri</label>
                  <input 
                    value={formData.period || ''}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Masalan: 1960 - 2000"
                  />
               </div>
             )}
             {(section === 'flora' || section === 'fauna') && (
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Qiziqarli fakt (Ixtiyoriy)</label>
                  <input 
                    value={formData.fact || ''}
                    onChange={(e) => setFormData({ ...formData, fact: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Noyob xususiyati yoki fakt..."
                  />
               </div>
             )}
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tavsif</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Rasm (Havola, Fayl yoki Qidirish)</label>
                  {formData.imageUrl && (
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-[10px] font-bold text-red-400 uppercase tracking-tighter hover:underline"
                    >
                      Rasmni tozalash
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="url"
                    placeholder="Internet havolasini kiriting..."
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const query = formData.name || formData.title || 'nature';
                      window.open(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, '_blank');
                    }}
                    className="px-6 bg-slate-100 border border-slate-200 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center group"
                    title="Rasmlarni qidirish"
                  >
                    <Globe className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                  </button>
                </div>

                <div className="relative group">
                  <div className={`border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-all hover:bg-emerald-50/30 hover:border-emerald-500/50 flex flex-col items-center justify-center cursor-pointer ${formData.imageUrl ? 'opacity-50 grayscale' : ''}`}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 500 * 1024) {
                            alert("Rasm hajmi juda katta! Iltimos, 500KB dan kichik rasm tanlang (Base64 limiti).");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadstart = () => setIsSaving(true);
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUrl: reader.result as string });
                            setIsSaving(false);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Plus className="w-8 h-8 text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">Rasm yuklash (Base64)</p>
                    <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-tighter">Max 500KB • Hosting talab qilinmaydi</p>
                  </div>
                </div>

                {formData.imageUrl && (
                  <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl group">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Format+tuushuntirib+bo%27lmadi';
                      }}
                    />
                    <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-white text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-mono">
                         {formData.imageUrl.startsWith('data:') ? 'LOKAL FAYL' : 'URL HAVOLA'}
                       </p>
                    </div>
                  </div>
                )}
             </div>
             <div className="flex gap-4 pt-6">
                <button 
                  disabled={isSaving}
                  type="submit" 
                  className="flex-1 bg-emerald-700 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-700/20 disabled:opacity-50"
                >
                  {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 border-2 border-slate-200 text-slate-400 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                >
                  Bekor qilish
                </button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

