import axios from "axios";
import useSWR from "swr";
import { PaginatedResult } from "../types/PaginatedResult";
import { UserDTO } from "../types/UserDTO";
import { RoleRequestDTO } from "./requests";

const API_URL = import.meta.env.VITE_AUTH_API_URL;
const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export const useUsers = (
  page: number,
  pageSize: number,
  sortBy: string = "userName",
  ascending: boolean = true
) => {
  const key = getUsersKey(page, pageSize, sortBy, ascending);

  const { data, error, isValidating } = useSWR<PaginatedResult<UserDTO>>(
    key,
    fetcher
  );

  return { data, error, isValidating };
};

export const getUsersKey = (
  page: number,
  pageSize: number,
  sortBy: string = "userName",
  ascending: boolean = true
) => {
  return `${API_URL}/api/v1/User/All/${page}/${pageSize}?sortBy=${sortBy}&ascending=${ascending}`;
};

export const getRoles = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/Role/All`, {
      withCredentials: true,
    });

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data.map((role) => role.roleName); // Извлекаем roleName
    } else {
      console.error(
        "Ошибка: getRoles вернул некорректные данные",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Ошибка загрузки ролей:", err);
    return [];
  }
};

export const getUserRoles = async (id: string) => {
  const response = await axios.get(`${API_URL}/api/v1/user/${id}/roles`, {
    withCredentials: true,
  });
  return response.data;
};

export const emailConfirmation = async (id: string) => {
  return axios.post(
    `${API_URL}/api/v1/user/email/confirm`,
    { id },
    { withCredentials: true }
  );
};

export const resetPassword = async (id: string) => {
  return axios.post(
    `${API_URL}/api/v1/account/password/reset`,
    { id },
    { withCredentials: true }
  );
};

export const changeEmail = async (id: string, newEmail: string) => {
  return axios.post(
    `${API_URL}/api/v1/account/email/change`,
    { id, newEmail },
    { withCredentials: true }
  );
};

export const updateRoles = async (request: RoleRequestDTO) => {
  const data = {
    id: request.id,
    roleName: request.roleName,
  };

  return axios.post(`${API_URL}/api/v1/role/set`, data, {
    withCredentials: true,
  });
};

export const removeRole = async (request: RoleRequestDTO) => {
  const data = {
    id: request.id,
    roleName: request.roleName,
  };

  return axios.post(`${API_URL}/api/v1/role/unset`, data, {
    withCredentials: true,
  });
};

export const searchUsers = async (query: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_AUTH_API_URL}/api/v1/search/users/${query}`,
    {
      withCredentials: true,
    }
  );

  return response.data.map((u: any) => ({
    id: u.id,
    username: u.userName,
    email: u.email,
    isEmailConfirmed: u.isEmailConfirmed,
  }));
};

export const deleteUser = async (userId: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/v1/User/${userId}`, {
    withCredentials: true,
  });
};
