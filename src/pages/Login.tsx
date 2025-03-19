import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "../services/authService";
import { useAppDispatch } from "@/store/store";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const result = await login(username, password, dispatch);
    if (result.success) {
      console.log("Успешный вход");
      setSuccess(true);
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Вход</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">Успешный вход</p>}
        <Input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-2"
        />
        <Button type="submit" className="mt-4 w-full">
          Войти
        </Button>
      </form>
    </div>
  );
};

export default Login;
