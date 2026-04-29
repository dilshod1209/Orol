import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FeedbackStatus } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorHandler';
import { Send, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'feedback'), {
        ...formData,
        status: FeedbackStatus.PENDING,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-slate-200"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tight">Qabul qilindi!</h3>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
          Sizning taklifingiz tizimga muvaffaqiyatli kiritildi. Tahlil natijalari bo'yicha bog'lanamiz.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
        >
          Yana yuborish
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-16 rounded-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
      
      <div className="flex items-center space-x-2 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">API Endpoint: /v1/feedback</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">Yangi <span className="text-emerald-500 italic font-medium">Taklif</span> <br/>Yaratish</h2>
      <p className="text-slate-500 mb-12 max-w-xl font-medium leading-relaxed">
        Tizim samaradorligini oshirish yoki yangi ma'lumotlar qo'shish bo'yicha o'z loyihangizni yuboring.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors font-medium text-slate-900"
              placeholder="Ismingizni kiriting"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Reference</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors font-medium text-slate-900"
              placeholder="example@mail.com"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Logical Message Container</label>
          <textarea 
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors font-medium text-slate-900 resize-none"
            placeholder="Taklif yoki mulohazangiz..."
          />
        </div>
        
        <button 
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-2xl shadow-slate-900/20 text-xs uppercase tracking-[0.2em]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit payload</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
