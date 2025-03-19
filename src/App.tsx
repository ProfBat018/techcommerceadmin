import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/store";
import { fetchUser } from "./services/authService";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Progress } from "@/components/ui/progress";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10; // Добавляем случайное значение к прогрессу
          return Math.min(oldProgress + diff, 90); // Не даем прогрессу превысить 90%
        });
      }, 300);

      await fetchUser(dispatch);
      clearInterval(interval);
      setProgress(100); // Когда данные загружены, сразу 100%
      setTimeout(() => setIsLoading(false), 500); // Даем эффект завершения
    };

    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-80">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Загрузка...
          </h2>
          <Progress className="w-full" value={progress} />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="*" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
