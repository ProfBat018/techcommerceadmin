import { useState, useEffect } from "react";
import { useUsers, searchUsers } from "../services/userService";
import { UserDTO } from "../types/UserDTO";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import UserActionsModal from "@/components/UserActionsModal";
import { Input } from "@/components/ui/input";

const Users = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data, isValidating } = useUsers(page, pageSize);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserDTO[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTerm.length > 1) {
        setSearching(true);
        const result = await searchUsers(searchTerm);
        setSearchResults(result);
        setSearching(false);
      } else {
        setSearchResults(null);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const usersToRender = searchResults ?? data?.data ?? [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Пользователи</h2>

      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Поиск по имени или email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96"
        />
        <Button variant="outline" onClick={() => setSearchTerm("")}>
          Очистить
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersToRender.map((user: UserDTO) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => setSelectedUser(user)}>
                    Управление
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!searchResults && (
        <Pagination
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {isValidating && <p>Обновление данных...</p>}
      {searching && <p>Поиск...</p>}

      {selectedUser && (
        <UserActionsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Users;

