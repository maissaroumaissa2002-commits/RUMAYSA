import { Prices } from "./types";

export const DEFAULT_PRICES: Prices = {
  editing: { 
    base: 80, 
    perPage: 25, 
    label: 'التدقيق اللغوي', 
    icon: 'SearchCheck', 
    desc: 'تدقيق إملائي ونحوي شامل للمخطوطة' 
  },
  rewriting: { 
    base: 200, 
    perPage: 50, 
    label: 'إعادة الكتابة', 
    icon: 'FileEdit', 
    desc: 'إعادة صياغة وتحرير المحتوى بأسلوب أدبي' 
  },
  formatting: { 
    base: 150, 
    perPage: 15, 
    label: 'التنسيق الداخلي', 
    icon: 'LayoutTemplate', 
    desc: 'تنسيق الصفحات والفقرات والعناوين' 
  },
  cover: { 
    base: 3000, 
    perPage: 0, 
    label: 'تصميم الغلاف', 
    icon: 'Image', 
    desc: 'تصميم غلاف احترافي أمامي وخلفي', 
    fixed: true 
  },
  printing: { 
    base: 500, 
    perPage: 12, 
    label: 'الطباعة', 
    icon: 'Printer', 
    desc: 'طباعة ورقية بجودة عالية وتجليد ممتاز' 
  }
};
