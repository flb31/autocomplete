import { AutoCompleteOption } from "../components/AutoComplete/types";
import { DummyJSONProductType, DummyJSONResponseType } from "./types";

export const dummyJson = async (
  query: string
): Promise<AutoCompleteOption[]> => {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${query}`
  );
  const data: DummyJSONResponseType = await response.json();
  return data.products.map(normalizeResult);
};

const normalizeResult = (
  product: DummyJSONProductType
): AutoCompleteOption => ({ value: String(product.id), name: product.title });
