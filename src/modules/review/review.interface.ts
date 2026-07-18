export interface ICreateReviewDTO {
  productId: string;
  rating: number;
  comment?: string;
  images?: string[];
}
