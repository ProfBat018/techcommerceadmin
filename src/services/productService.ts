import axios from "axios";
import useSWR from "swr";
import { PaginatedResult } from "../types/PaginatedResult";
import { ProductDTO } from "../types/ProductDTO";

const API_URL = import.meta.env.VITE_TECH_API_URL;
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export const useProducts = (page: number, pageSize: number) => {
  return useSWR<PaginatedResult<ProductDTO>>(
    `${API_URL}/api/v1/Product/All/${page}/${pageSize}`,
    fetcher
  );
};

export const getProductById = async (id: string): Promise<ProductDTO> => {
  const response = await axios.get(`${API_URL}/api/v1/Product/${id}`, { withCredentials: true });
  return response.data;
};
export const updateProduct = async (id: string, productData: ProductDTO, image?: File): Promise<ProductDTO> => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("productName", productData.productName);
    formData.append("description", productData.productDescription);
    formData.append("price", productData.price.toString());
    formData.append("imagePath", productData.imagePath || "");
  
    if (image) {
      formData.append("image", image);
    }
  
    const response = await axios.post(`${API_URL}/api/v1/Product/Update`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    return response.data;
  };