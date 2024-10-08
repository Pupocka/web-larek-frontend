import { IOrder, IOrderResult, IProduct } from "../types";
import { Api, ApiListResponse} from "./base/api";

export class LarekApi extends Api {
  private readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getCatalog(): Promise<IProduct[]> {
    return this.get('/product')
    .then((data: ApiListResponse<IProduct>) => {
      return data.items.map((item) => ({
        ...item,
        image: `${this.cdn}${item.image}`,
      }));
    });
  }

  order(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(
        (data: IOrderResult) => data
    );
  }
}