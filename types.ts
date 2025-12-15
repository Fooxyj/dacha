export interface Category {
  id: number;
  name: string;
  order: number;
}

export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  weight: string;
  image: string;     // relative path from DB
  image_url: string; // absolute URL provided by serializer
  category: number;  // ID
  category_name: string;
  popular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface ReservationData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}