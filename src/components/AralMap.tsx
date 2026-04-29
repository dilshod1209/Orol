import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

export const AralMap = () => {
  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              <span>Joylashuv Monitoringi</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight italic">
              Orol Dengizi <br/> 
              <span className="text-emerald-500 font-medium not-italic">Geografik Hududi</span>
            </h2>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              Orol dengizi O'rta Osiyoning markazida, O'zbekiston va Qozog'iston 
              chegarasida joylashgan. Ushbu hudud global ekologik ahamiyatga ega 
              va biz uni raqamli xaritalar orqali kuzatib boramiz.
            </p>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
               <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 shrink-0">
                     <Navigation className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Koordinatalar</h4>
                     <p className="text-xs font-mono text-slate-500">45.0000° N, 59.0000° E</p>
                     <p className="text-xs text-slate-400 mt-2 italic">Markaziy Osiyo ekotizimining yuragi</p>
                  </div>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 ring-1 ring-slate-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1544605.518648839!2d58.46337890624999!3d45.04505960000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41f3e792e31e5f8f%3A0xe792a6c117367e9!2sAral%20Sea!5e0!3m2!1sen!2s!4v1714243300000!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Aral Sea Map"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
