import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Database, Code, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center bg-slate-50 overflow-hidden border-b border-slate-200">
      {/* Structural Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900/5 -skew-x-12 translate-x-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded">Architect v2.0</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Database Integration</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Orol Ekotizimi <br/> 
              <span className="text-emerald-500 italic font-medium">Raqamli Portal</span>
            </h1>
            
            <p className="max-w-xl text-lg text-slate-500 mb-10 leading-relaxed font-medium">
              Professional darajadagi ma'lumotlar bazasi, CRUD boshqaruvi va 
              ekologik monitoring tizimi. Orolning o'tmishi va kelajagini 
              raqamlashtirish orqali o'rganamiz.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/flora"
                className="group flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-slate-800 shadow-2xl shadow-slate-900/20 text-sm uppercase tracking-widest"
              >
                <span>Portalga kirish</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/feedback"
                className="px-8 py-4 rounded-xl font-bold text-slate-900 border border-slate-300 hover:bg-slate-100 transition-all text-sm uppercase tracking-widest"
              >
                Taklif yuborish
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 pt-12 border-t border-slate-200">
               <div className="flex flex-col">
                  <Database className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-xs font-bold text-slate-900 uppercase">50+ Flora</span>
               </div>
               <div className="flex flex-col">
                  <Code className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-xs font-bold text-slate-900 uppercase">REST API</span>
               </div>
               <div className="flex flex-col">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-xs font-bold text-slate-900 uppercase">Admin Auth</span>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative group"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-1 transition-transform group-hover:rotate-0 duration-700">
               <img 
                 src="https://images.unsplash.com/photo-1549449881-22920fbb7dfd?q=80&w=2070&auto=format&fit=crop" 
                 alt="Aral Sea Landscape" 
                 className="w-full h-[500px] object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
               
               <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                     <p className="text-white font-mono text-xs mb-1 uppercase tracking-tighter">Current Status</p>
                     <h3 className="text-white text-xl font-black italic">Orol Dengizi Monitoringi</h3>
                  </div>
               </div>
            </div>
            
            {/* Floating Detail Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-[200px] z-20">
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 font-mono">Ekotizim Holati</h4>
               <p className="text-3xl font-black text-slate-900 leading-none">99.2%</p>
               <p className="text-[10px] text-emerald-600 font-black uppercase mt-2 tracking-widest bg-emerald-50 px-2 py-1 rounded inline-block">Stabil</p>
            </div>

            <div className="absolute -top-6 -right-6 bg-emerald-500 text-white p-6 rounded-full shadow-xl z-20 animate-pulse">
               <Database className="w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

