import axios from "axios";
import useSWR from "swr";
import { PaginatedResult } from "../types/PaginatedResult";
import { UserDTO } from "../types/UserDTO";

const API_URL = import.meta.env.VITE_AUTH_API_URL;
const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export const useUsers = (page: number, pageSize: number) => {
  const { data, error, isValidating } = useSWR<PaginatedResult<UserDTO>>(
    `${API_URL}/api/v1/User/All/${page}/${pageSize}`,
    fetcher
  );

  console.log("API response:", data, "Error:", error);
  return { data, error, isValidating }; // Теперь возвращаем isValidating
};

export const getUserRoles = async (id: string) => {
  const response = await axios.get(`${API_URL}/api/v1/auth/${id}/roles`, {
    withCredentials: true,
  });
  return response.data;
};

export const sendEmailConfirmation = async (id: string) => {
  return axios.post(
    `${API_URL}/api/v1/auth/${id}/send-confirmation`,
    {},
    { withCredentials: true }
  );
};

export const resetPassword = async (id: string) => {
  return axios.post(
    `${API_URL}/api/v1/auth/${id}/reset-password`,
    {},
    { withCredentials: true }
  );
};

export const changeEmail = async (id: string, newEmail: string) => {
  return axios.put(
    `${API_URL}/api/v1/auth/${id}/change-email`,
    { email: newEmail },
    { withCredentials: true }
  );
};

export const updateRoles = async (id: string, roles: string[]) => {
  return axios.put(
    `${API_URL}/api/v1/auth/${id}/roles`,
    { roles },
    { withCredentials: true }
  );
};
