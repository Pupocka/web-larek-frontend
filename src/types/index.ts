export interface IProduct {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index?: number;
}

export interface IOrder {
  email?: string;
  phone?: string;
  address?: string;
  payment?: string;
  total?: number;
  items?: string[];
}

export interface IOrderResult {
  id: string;
}

export interface IProductsData{
  items: IProduct[];
  preview: string | null;
  getProduct(productId: string): IProduct;
}
export type PaymentType = 'card' | 'cash';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

