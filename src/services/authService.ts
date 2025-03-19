/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { setUser } from "../store/authSlice";
import { AppDispatch } from "../store/store";
import { UserInfo } from "../types/UserInfo";

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export const login = async (
  username: string,
  password: string,
  dispatch: AppDispatch
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/auth/login`,
      { username, password },
      { withCredentials: true }
    );

    console.log(response.data);

    if (response.data?.isSuccess && response.data?.data) {
      const userInfo: UserInfo = response.data.data;

      console.log("userInfo", userInfo);

      dispatch(setUser(userInfo));
    }

    return { success: true };
  } catch (err: any) {
    console.error("Ошибка авторизации:", err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data?.message || "Ошибка авторизации",
    };
  }
};
export const fetchUser = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
      withCredentials: true,
    });

    console.log("Ответ от /me:", response.data);

    if (response.data?.isSuccess && response.data?.data) {
      dispatch(setUser(response.data.data));
    } else {
      dispatch(setUser(null));
    }
  } catch (err) {
    console.error("Ошибка получения пользователя:", err);
    dispatch(setUser(null));
  }
};

export const logout = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/auth/logout`,
      {}, // Тело запроса должно быть пустым
      { withCredentials: true } // Это конфигурация запроса
    );

    if (response.data?.isSuccess) {
      dispatch(setUser(null));
    }
  } catch (err) {
    console.error("Ошибка выхода:", err);
  }
};
