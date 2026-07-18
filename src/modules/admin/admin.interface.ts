export interface IDashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  orders: {
    total: number;
    pending: number;
    delivered: number;
    cancelled: number;
    revenue: number;
  };
  products: {
    total: number;
    outOfStock: number;
  };
  staff: {
    total: number;
    available: number;
  };
}

export interface ISalesReport {
  date: string;
  orders: number;
  revenue: number;
}
