import { Product } from "./product.model";

export interface ResponseApi {
  name: string;
  message: string;
  data: Product[];
}
