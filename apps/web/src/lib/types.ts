export interface User {
  id: string;
  email: string;
}

export type Me = {
  id: string;
  email: string;
  emailVerified: boolean;
  canDeleteAccount: boolean;
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategory = 'APPETIZER' | 'MAIN' | 'DESSERT' | 'BEVERAGE' | 'PACKAGE';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  guestCount: number;
  specialRequests?: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
