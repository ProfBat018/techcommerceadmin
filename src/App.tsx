import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./store/store";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Progress } from "@/components/ui/progress";
import { fetchUser } from "./services/authService";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 90);
        });
      }, 300);

      await fetchUser(dispatch);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsLoading(false), 500);
    };

    loadUser();
  }, [dispatch]);

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
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard/*" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

export default App;
