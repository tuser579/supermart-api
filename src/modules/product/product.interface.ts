export interface ICreateProductDTO {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand?: string;
  stock: number;
  images: string[];
}

export interface IUpdateProductDTO extends Partial<ICreateProductDTO> {}

export interface IProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
  outOfStock?: boolean | 'true' | 'false';
  lowStock?: boolean | 'true' | 'false';
  includeInactive?: boolean | 'true' | 'false';
}

export interface IRestockProductDTO {
  stock?: number;
  addStock?: number;
}

export interface IProductResponse {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discountPrice?: number | null;
  category: string;
  brand?: string | null;
  stock: number;
  images: string[];
  rating: number;
  ratingCount: number;
  numReviews?: number;
  isActive: boolean;
  createdAt: Date;
}
