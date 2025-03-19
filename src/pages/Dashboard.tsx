import { useAppDispatch } from "../store/store";
import { logout } from "../services/authService";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Users from "./Users";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(dispatch);
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Админ Панель</h2>
        <ul>
          <li className="mb-2">
            <Link to="users">Пользователи</Link>
          </li>
          <li className="mb-2">
            <Link to="products">Продукты</Link>
          </li>
          <li className="mb-2">
            <Link to="categories">Категории</Link>
          </li>
          <li className="mb-2">
            <Link to="orders">Заказы</Link>
          </li>
        </ul>
        <Button onClick={handleLogout} className="mt-auto">
          Выйти
        </Button>
      </nav>
      <main className="flex-1 p-6">
        <Routes>
          <Route path="users" element={<Users />} />
          <Route
            path="*"
            element={
              <h1 className="text-2xl font-bold">
                Добро пожаловать в Админ Панель
              </h1>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
