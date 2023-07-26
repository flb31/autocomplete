export type DummyJSONProductType = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
};

export type DummyJSONResponseType = {
  products: DummyJSONProductType[];
};
