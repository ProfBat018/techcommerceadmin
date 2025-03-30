import useSWR from "swr";
import axios from "axios";
import Dashboard from "../pages/Dashboard";

const API_URL = import.meta.env.VITE_TECH_API_URL;

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => {
    return res.data.data;
  });

export const useProductCount = (productId: string) => {
  return useSWR<number>(
    `${API_URL}/api/v1/Product/Count/${productId}`,
    fetcher
  );
};
