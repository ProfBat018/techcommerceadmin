import axios from "axios";
import useSWR from "swr";
import { PaginatedResult } from "../types/PaginatedResult";
import { ProductDTO } from "../types/ProductDTO";

const API_URL = import.meta.env.VITE_TECH_API_URL;
const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);


export const useProducts = (
  page: number,
  pageSize: number,
  sortBy: string = "name",
  ascending: boolean = true
) => {
  const key = getProductsKey(page, pageSize, sortBy, ascending);
  return useSWR<PaginatedResult<ProductDTO>>(key, fetcher);
};

export const getProductsKey = (
  page: number,
  pageSize: number,
  sortBy: string = "name",
  ascending: boolean = true
) => {
  return `${API_URL}/api/v1/Product/All/${page}/${pageSize}?sortBy=${sortBy}&ascending=${ascending}`;
};

export const getProductById = async (id: string): Promise<ProductDTO> => {
  const response = await axios.get(`${API_URL}/api/v1/Product/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getProductCountById = async (id: string): Promise<number> => {
  const response = await axios.get(`${API_URL}/api/v1/Product/Count/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: ProductDTO,
  count: number,
  image?: File
): Promise<ProductDTO> => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("productName", productData.productName);
  formData.append("description", productData.productDescription);
  formData.append("price", productData.price.toString());
  formData.append("imagePath", productData.imagePath || "");
  formData.append("count", count.toString());

  console.log(formData.get("id"));
  console.log(formData.get("count"));

  if (image) {
    formData.append("image", image);
  }

  const response = await axios.post(
    `${API_URL}/api/v1/Product/Update`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};
