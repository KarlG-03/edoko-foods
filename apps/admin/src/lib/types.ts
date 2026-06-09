export type AdminUser = {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  emailVerified: boolean;
  createdAt: string;
  activeSessionCount: number;
};

export type AdminSession = {
  id: string;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
};

export type AdminStats = {
  userCount: number;
  activeSessionCount: number;
};

export type MenuCategory = 'APPETIZER' | 'MAIN' | 'DESSERT' | 'BEVERAGE' | 'PACKAGE';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type OrderItem = {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
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
};

export type Notification = {
  id: string;
  orderId?: string;
  order?: Order;
  type: 'IN_APP' | 'EMAIL';
  title: string;
  message: string;
  scheduledAt: string;
  sentAt?: string;
  isRead: boolean;
  createdAt: string;
};

export type NotificationSetting = {
  id: string;
  userId: string;
  enableInApp: boolean;
  enableEmail: boolean;
  reminderHoursBefore: number;
};
