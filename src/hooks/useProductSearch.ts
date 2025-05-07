import useSWR from "swr";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_TECH_API_URL;

export const useProductSearch = (query: string) => {
  return useSWR(
    query ? [`product-search`, query] : null,
    () =>
      axios
        .get(`${BASE_URL}/api/v1/Search/products/${query}`)
        .then((res) => res.data),
    {
      keepPreviousData: true,
    }
  );
};
