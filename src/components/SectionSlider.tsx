
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface Item {
  id?: string;
  name?: string;
  title?: string;
  description: string;
  imageUrl?: string;
  fact?: string;
  period?: string;
}

interface SectionSliderProps {
  items: Item[];
  title: string;
}

export function SectionSlider({ items, title }: SectionSliderProps) {
  if (!items.length) return null;

  return (
    <section className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-2">{title}</h2>
            <p className="text-emerald-400 font-mono text-xs uppercase tracking-widest italic">Orol Eco Eksponatlari</p>
          </motion.div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          className="pb-20"
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id || index} style={{ width: '320px', height: '480px' }}>
              <div className="relative w-full h-full rounded-3xl overflow-hidden group shadow-2xl bg-slate-800 border border-white/10">
                <img 
                  src={item.imageUrl || `https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=600`} 
                  alt={item.name || item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                    {item.period || 'Ekotizim'}
                  </span>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {item.name || item.title}
                  </h3>
                  <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed mb-4 font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    {item.description}
                  </p>
                  
                  {item.fact && (
                    <div className="bg-emerald-500/10 border-l-2 border-emerald-500 p-2 text-[10px] text-emerald-400 italic mb-4 opacity-0 group-hover:opacity-100 transition-all delay-100">
                      "{item.fact}"
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    <span>To'liq ma'lumot</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
