export interface IProduct {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index?: number;
}

export interface IOrderForm {
  email?: string;
  phone?: string;
  address?: string;
  payment?: string;
}

export interface IOrder extends IOrderForm{
  total: number;
  items: string[];
}

export interface IOrderResult {
	total: number;
  id: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

