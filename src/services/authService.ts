/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { setLoading, setUser } from "../store/authSlice";
import { AppDispatch } from "../store/store";

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export const login = async (
  username: string,
  password: string,
  dispatch: AppDispatch
) => {
  try {
    dispatch(setLoading(true));
    await axios.post(
      `${API_URL}/api/v1/auth/login`,
      { username, password },
      { withCredentials: true }
    );
    await fetchUser(dispatch); // Проверяем, успешно ли вошел пользователь
    return { success: true };
  } catch (err: any) {
    console.error("Ошибка авторизации:", err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data?.message || "Ошибка авторизации",
    };
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchUser = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
      withCredentials: true,
    });

    console.log("Ответ от /me:", response.data);

    if (response.data?.isSuccess) {
      dispatch(setUser({ isAuthenticated: true })); // Устанавливаем флаг аутентификации
    } else {
      dispatch(setUser(null)); // Если токен невалиден
    }
  } catch (err) {
    console.error("Ошибка получения пользователя:", err);
    dispatch(setUser(null)); // В случае ошибки очищаем состояние
  }
};

export const logout = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );

    if (response.data?.isSuccess) {
      dispatch(setUser(null));
    }
  } catch (err) {
    console.error("Ошибка выхода:", err);
  }
};
