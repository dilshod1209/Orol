import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandler';
import { motion } from 'motion/react';
import { Info, Sparkles } from 'lucide-react';

interface ListPageProps {
  collectionName: 'flora' | 'fauna' | 'history';
  title: string;
  subtitle: string;
}

export const GenericListView: React.FC<ListPageProps> = ({ collectionName, title, subtitle }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, collectionName);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in memory to handle items without createdAt field
      const sortedData = data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setItems(sortedData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, collectionName);
    });
    return () => unsubscribe();
  }, [collectionName]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-16">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">Database Entry</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">{title}</h1>
        <p className="max-w-2xl text-slate-500 text-lg font-medium leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group"
          >
            <div className="aspect-[4/5] bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center">
               {item.imageUrl ? (
                 <img 
                   src={item.imageUrl} 
                   alt={item.name || item.title} 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
               ) : (
                 <div className="z-10 bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full mx-8">
                    <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                    <p className="text-[9px] font-mono text-emerald-400/80 leading-tight uppercase tracking-tighter mb-2">
                      Visual Integration Metadata
                    </p>
                    <p className="text-[10px] font-mono text-white/90 leading-relaxed italic">
                      "{item.imagePrompt || 'General ecosystem illustration'}"
                    </p>
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
               <div className="absolute top-4 left-4 flex space-x-1 z-20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
               </div>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">{item.name || item.title}</h3>
                {item.period && (
                  <span className="text-[9px] uppercase tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                    {item.period}
                  </span>
                )}
              </div>
              
              <p className="text-slate-500 mb-6 line-clamp-4 text-sm font-medium leading-relaxed">
                {item.description}
              </p>
              
              {item.fact && (
                <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-xs text-slate-600 font-medium">
                  <Info className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{item.fact}</span>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {item.id?.substring(0, 8)}...</span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-slate-900 transition-colors">Batafsil</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
