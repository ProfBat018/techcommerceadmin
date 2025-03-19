import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";

const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.isLoading); // Добавляем проверку загрузки

  if (isLoading) {
    return null; // Пока идет загрузка — ничего не рендерим
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
