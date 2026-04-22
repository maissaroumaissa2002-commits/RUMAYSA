export interface ServicePrice {
  base: number;
  perPage: number;
  label: string;
  icon: string;
  desc: string;
  fixed?: boolean;
}

export interface Prices {
  [key: string]: ServicePrice;
}

export interface BookInfo {
  title: string;
  author: string;
  pageCount: number;
  copyCount: number;
}

export interface ServiceItemProps {
  id: string;
  price: ServicePrice;
  isSelected: boolean;
  onToggle: (id: string) => void;
}
