/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Settings, 
  Printer, 
  ChevronDown, 
  RotateCcw, 
  Info,
  SearchCheck,
  FileEdit,
  LayoutTemplate,
  Image,
  Check,
  Calculator,
  Type
} from 'lucide-react';
import { DEFAULT_PRICES } from './constants';
import { Prices, BookInfo } from './types';

// Map icon strings to Lucide components
const IconMap: Record<string, any> = {
  SearchCheck,
  FileEdit,
  LayoutTemplate,
  Image,
  Printer
};

export default function App() {
  const [prices, setPrices] = useState<Prices>(() => {
    const saved = localStorage.getItem('rumaysa_prices');
    return saved ? JSON.parse(saved) : DEFAULT_PRICES;
  });

  const [bookInfo, setBookInfo] = useState<BookInfo>({
    title: '',
    author: '',
    pageCount: 150,
    copyCount: 100
  });

  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(['editing', 'formatting', 'cover', 'printing']));
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('rumaysa_prices', JSON.stringify(prices));
  }, [prices]);

  const toggleService = (id: string) => {
    const next = new Set(selectedServices);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedServices(next);
  };

  const updatePrice = (id: string, field: 'base' | 'perPage', value: number) => {
    setPrices(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const resetPrices = () => {
    setPrices(DEFAULT_PRICES);
  };

  const calculations = useMemo(() => {
    let subtotal = 0;
    const items = Array.from(selectedServices).map(id => {
      const p = prices[id];
      let cost = p.base;
      let details = 'سعر ثابت';

      if (id === 'printing') {
        cost += (p.perPage * bookInfo.pageCount * bookInfo.copyCount);
        details = `${bookInfo.pageCount} ص × ${bookInfo.copyCount} ن × ${p.perPage} د.ج`;
      } else if (!p.fixed) {
        cost += (p.perPage * bookInfo.pageCount);
        details = `${bookInfo.pageCount} صفحة × ${p.perPage} د.ج`;
      }
      
      subtotal += cost;
      return { id, label: p.label, key: id, cost, details, icon: p.icon };
    });

    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    return { items, subtotal, discountAmount, total };
  }, [selectedServices, prices, bookInfo, discountPercent]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-primary text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-lg"
            >
              <BookOpen size={28} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">دار رميسة للنشر</h1>
              <p className="text-xs text-blue-200/80 font-medium">نظام حساب أتعاب الخدمات والطباعة</p>
            </div>
          </div>
          
          <div className="flex gap-3 no-print">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5 flex items-center gap-2 text-sm font-medium"
            >
              <Settings size={18} className={showSettings ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">إعدادات الأسعار</span>
            </button>
            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 bg-secondary hover:bg-yellow-500 text-primary font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">طباعة عرض السعر</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden no-print"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 mb-8">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                      <Settings size={20} />
                    </div>
                    تعديل تعرفة الخدمات (دينار جزائري)
                  </h2>
                  <button 
                    onClick={resetPrices}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-bold group"
                  >
                    <RotateCcw size={14} className="group-hover:rotate-180 transition-transform" />
                    استعادة الإعدادات الافتراضية
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(Object.entries(prices) as [string, any][]).map(([id, p]) => (
                    <div key={id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h3 className="font-bold text-primary mb-4 text-sm flex items-center gap-2">
                        {p.label}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1.5 font-bold">السعر الثابت</label>
                          <input 
                            type="number" 
                            value={p.base} 
                            onChange={(e) => updatePrice(id, 'base', Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none bg-white text-sm"
                          />
                        </div>
                        {!p.fixed && (
                          <div>
                            <label className="text-xs text-slate-500 block mb-1.5 font-bold">سعر الصفحة</label>
                            <input 
                              type="number" 
                              value={p.perPage} 
                              onChange={(e) => updatePrice(id, 'perPage', Number(e.target.value))}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none bg-white text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Book Info Section */}
            <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Type size={20} />
                </div>
                بيانات المخطوطة والكتاب
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">عنوان الكتاب</label>
                  <input 
                    type="text" 
                    value={bookInfo.title}
                    onChange={e => setBookInfo({...bookInfo, title: e.target.value})}
                    placeholder="أدخل عنوان الإصدار..." 
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">اسم المؤلف / الكاتب</label>
                  <input 
                    type="text" 
                    value={bookInfo.author}
                    onChange={e => setBookInfo({...bookInfo, author: e.target.value})}
                    placeholder="اسم المؤلف بالكامل..." 
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">عدد الصفحات</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={bookInfo.pageCount}
                      min={1}
                      onChange={e => setBookInfo({...bookInfo, pageCount: Number(e.target.value)})}
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">صفحة</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">الكمية (عدد النسخ)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={bookInfo.copyCount}
                      min={1}
                      onChange={e => setBookInfo({...bookInfo, copyCount: Number(e.target.value)})}
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">نسخة</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 no-print">
              {(Object.entries(prices) as [string, any][]).map(([id, p]) => {
                const Icon = IconMap[p.icon] || Info;
                const isSelected = selectedServices.has(id);
                return (
                  <motion.div
                    key={id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleService(id)}
                    className={`group relative p-6 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
                      isSelected 
                        ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div className={`p-3 rounded-2xl transition-colors ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Icon size={24} />
                      </div>
                      <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-secondary border-secondary scale-110' : 'bg-transparent border-slate-200'
                      }`}>
                        {isSelected && <Check size={16} strokeWidth={3} className="text-primary" />}
                      </div>
                    </div>
                    
                    <div className="mt-5 relative z-10">
                      <h3 className="text-lg font-black mb-1">{p.label}</h3>
                      <p className={`text-sm mb-4 leading-relaxed ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {p.desc}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          يبدأ من {p.base.toLocaleString()} د.ج
                        </span>
                        {!p.fixed && (
                          <span className={`text-[10px] uppercase tracking-wider font-bold ${
                            isSelected ? 'text-secondary' : 'text-slate-400'
                          }`}>
                            + {p.perPage} د.ج / ص
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Decorative element */}
                    {isSelected && (
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar / Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-8 shadow-2xl border-2 border-primary/5 print:border-none print:shadow-none">
              <div className="text-center mb-8 border-b border-slate-100 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-xl shadow-primary/20">
                  <Calculator size={32} />
                </div>
                <h2 className="text-2xl font-black text-primary">ملخص التكاليف</h2>
                <p className="text-slate-400 text-sm mt-1 font-medium italic">عرض سعر تقديري أولي</p>
              </div>

              {/* Invoice Breakdown */}
              <div className="space-y-4 mb-8">
                {(bookInfo.title || bookInfo.author) && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2">
                    {bookInfo.title && <div className="font-black text-primary text-sm leading-tight mb-1">{bookInfo.title}</div>}
                    {bookInfo.author && <div className="text-slate-500 text-xs font-bold leading-tight">{bookInfo.author}</div>}
                    <div className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">{bookInfo.pageCount} صفحة | {bookInfo.copyCount} نسخة</div>
                  </div>
                )}
                
                {calculations.items.length > 0 ? (
                  calculations.items.map(item => {
                    const Icon = IconMap[item.icon] || Info;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={item.id} 
                        className="flex justify-between items-center group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors flex items-center justify-center">
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-700">{item.label}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{item.details}</div>
                          </div>
                        </div>
                        <div className="text-sm font-black text-primary bg-slate-50 px-3 py-1 rounded-lg">
                          {item.cost.toLocaleString()}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center text-slate-400 py-12 text-sm italic font-medium">
                    يرجى اختيار خدمة واحدة على الأقل...
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4 relative overflow-hidden">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">المجموع الفرعي:</span>
                  <span className="text-slate-700">{calculations.subtotal.toLocaleString()} د.ج</span>
                </div>
                
                <div className="flex justify-between items-center no-print border-t border-slate-200 pt-3">
                  <span className="text-xs font-bold text-slate-500">الخصم الممنوح (%)</span>
                  <input 
                    type="number" 
                    value={discountPercent}
                    min={0}
                    max={100}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-slate-200 text-center text-sm font-bold focus:ring-2 focus:ring-secondary/20 outline-none"
                  />
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-xs font-black text-red-500">
                    <span>قيمة الخصم:</span>
                    <span>-{calculations.discountAmount.toLocaleString()} د.ج</span>
                  </div>
                )}

                <div className="border-t-2 border-dashed border-slate-200 pt-4 flex flex-col gap-1 items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">الإجمالي النهائي</span>
                  <div className="text-3xl font-black text-primary leading-none">
                    {calculations.total.toLocaleString()}
                    <span className="text-sm font-bold mr-1.5 text-secondary">د.ج</span>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute right-0 top-0 w-1 h-full bg-secondary" />
              </div>

              {/* Note */}
              <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="p-2 bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20">
                  <Info size={16} />
                </div>
                <div className="text-[10px] text-blue-600 font-bold leading-relaxed">
                  هذه الأسعار تقديرية وتخضع للمراجعة النهائية بناءً على طبيعة المحتوى وتكاليف الورق الحالية بالسوق.
                </div>
              </div>

              {/* Printing footer (only visible when printed) */}
              <div className="hidden print:block mt-12 pt-8 border-t border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400">دار رميسة للنشر والتوزيع - الجزائر</p>
                <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest">{new Date().toLocaleDateString('ar-DZ', { dateStyle: 'full' })}</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 no-print">
        <p className="text-xs font-bold">جميع الحقوق محفوظة &copy; {new Date().getFullYear()} دار رميسة للنشر</p>
      </footer>
    </div>
  );
}
