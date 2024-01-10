export interface ProductDetailsData {
  title: string;
  slug?: string;
  desc: string;
  category: string;
  initialPrice: number;
  price: number;
  image?: string;
  discount: number;
  rating: number;
  numReviews: number;
  reviews: any;
  quantity: number;
  createdBy?: any;
  createdAt: Date;
  updatedAt: Date;
}