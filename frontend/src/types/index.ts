
// ---------- Auth ----------
export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
}

// ---------- Categories ----------
export interface Category {
  id: number;
  name: string;
}

export interface CategoryCreateUpdateDto {
  name: string;
}

// ---------- Products ----------
export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName?: string;
}

export interface ProductCreateUpdateDto {
  name: string;
  price: number;
  categoryId: number;
}

// ---------- Sales ----------
export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

export interface SaleCreateRequest {
  customerName: string;
  items: SaleItemRequest[];
}

export interface SaleItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleResponse {
  id: number;
  date: string;
  customerName: string;
  total: number;
  items: SaleItemResponse[];
}
