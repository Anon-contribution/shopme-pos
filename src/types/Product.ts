export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
}

export interface ProductCategory {
  value: number;
  label: string;
}
