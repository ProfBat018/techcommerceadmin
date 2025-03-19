import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardStats = () => {
  const [stats, setStats] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    axios.get("/api/stats", { withCredentials: true })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Ошибка загрузки статистики", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Статистика</h2>
      <div className="bg-white p-4 shadow rounded">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardStats;