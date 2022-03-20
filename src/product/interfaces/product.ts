export interface IProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  status: string;
  photoFn: string;
}

export interface IProductsPaginationResponse {
  products: IProduct[];
  pageCount: number;
  currentPage: number;
}
