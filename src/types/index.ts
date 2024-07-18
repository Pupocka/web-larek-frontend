export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number;
}

export interface IOrder {
  email: string;
  phone: number;
  address: string;
  payment: PaymentType;
  total: number;
  items: string[];
}

export interface IProductsData{
  items: IProduct[];
  preview: string | null;
  getProduct(productId: string): IProduct;
}

export interface IOrderData{
  getOrderInfo(): IOrder;
  setOrderInfo(userData: IOrder): void;
  checkUserValidation(data: Record<keyof TUser, string>):boolean;
}

export interface IBasketData{
  total: IProduct['price'];
  items: IProduct['id'];
  addProduct(product: IProduct): void;
  deleteProduct(productId: string, playload: null): void;
}

export type TProductInfo = Pick<IProduct,  'image' | 'title' | 'category' | 'price'>

export type TProductModalInfo = Pick<IProduct, 'description' | 'image' | 'title' | 'category' | 'price'>

export type TOrderModalPaymentAddress = Pick<IOrder, 'payment' | 'address'>

export type TOrderModalEmailPhone = Pick<IOrder, 'email' | 'phone'>

export type TUser = Pick<IOrder, 'email' | 'phone' | 'address' | 'payment'>

export enum ProductCategory {
  'софт-скил' = 'soft',
  'другое' = 'other',
  'хард-скил' = 'hard',
  'дополнительное' = 'additional',
  'кнопка' = 'button'
}

export type PaymentType = 'card' | 'cash';