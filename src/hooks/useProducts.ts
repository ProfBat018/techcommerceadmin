import useSWR from "swr";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_TECH_API_URL;

export const getProductsKey = (
  page: number,
  pageSize: number,
  sortBy: string,
  ascending: boolean,
  searchTerm: string
) => [`products`, page, pageSize, sortBy, ascending, searchTerm];

export const useProducts = (
  page: number,
  pageSize: number,
  sortBy: string,
  ascending: boolean,
  searchTerm: string
) => {
  const key = getProductsKey(page, pageSize, sortBy, ascending, searchTerm);

  return useSWR(key, () =>
    axios
      .get(`${BASE_URL}/api/v1/Product/All/${page}/${pageSize}`, {
        params: {
          sortBy,
          ascending,
          searchTerm,
        },
      })
      .then((res) => res.data)
  );
};