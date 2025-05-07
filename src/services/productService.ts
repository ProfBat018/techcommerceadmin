import axios from "axios";

import { ProductDTO } from "../types/ProductDTO";

const API_URL = import.meta.env.VITE_TECH_API_URL;

export const getProductById = async (id: string): Promise<ProductDTO> => {
  const response = await axios.get(`${API_URL}/api/v1/Product/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const createProduct = async (productData: {
  productName: string;
  description: string;
  price: number;
  categories: string[];
  images: File[];
  mainImageIndex: number;
}): Promise<ProductDTO> => {
  const formData = new FormData();
  formData.append("productName", productData.productName);
  formData.append("description", productData.description);
  formData.append("price", productData.price.toString());

  productData.categories.forEach((cat) => {
    formData.append("categories", cat);
  });

  productData.images.forEach((image) => {
    formData.append("images", image); // backend должен ожидать `IFormFileCollection`
  });

  formData.append("mainImageIndex", productData.mainImageIndex.toString());

  const response = await axios.post(
    `${API_URL}/api/v1/Product/Create`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

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
