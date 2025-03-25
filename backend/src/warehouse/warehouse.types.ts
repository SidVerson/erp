import { Product } from '../products/product.entity';

export interface StockInfo {
  product: Product;
  inStock: number;
  expected: number;
}

export interface SingleStockInfo {
  inStock: number;
  expected: number;
}
