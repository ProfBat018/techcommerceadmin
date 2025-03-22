import useSWR from "swr";
import axios from "axios";

const API_URL = import.meta.env.VITE_TECH_API_URL;

export interface CategoryDTO {
  categoryName: string;
  parentCategoryName: string;
}

export const useCategories = () => {
  return useSWR<{ data: CategoryDTO[] }>(
    `${API_URL}/api/v1/Category/GetCategories/All/1/100`, // пока без пагинации
    (url) => axios.get(url, { withCredentials: true }).then((res) => res.data)
  );
};