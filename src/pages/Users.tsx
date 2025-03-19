import { useState } from "react";
import { useUsers } from "../services/userService";
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

const Users = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data, isValidating } = useUsers(page, pageSize);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Пользователи</h2>
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
            {data?.data.map((user: UserDTO) => (
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
      <Pagination
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
      {isValidating && <p>Обновление данных...</p>}
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
