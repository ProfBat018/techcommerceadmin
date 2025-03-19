import { useEffect, useState } from "react";
import { getUserRoles, sendEmailConfirmation, resetPassword, changeEmail, updateRoles } from "../services/userService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserDTO } from "@/types/UserDTO";

interface UserActionsModalProps {
  user: UserDTO;
  onClose: () => void;
}

const UserActionsModal: React.FC<UserActionsModalProps> = ({ user, onClose }) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      const userRoles = await getUserRoles(user.id);
      setRoles(userRoles);
      setLoading(false);
    };

    loadRoles();
  }, [user.id]);

  const handleChangeEmail = async () => {
    const newEmail = prompt("Введите новый email:");
    if (newEmail) {
      await changeEmail(user.id, newEmail);
      alert("Email обновлен!");
    }
  };

  const handleUpdateRoles = async () => {
    const newRoles = prompt("Введите новые роли через запятую:")?.split(",").map(r => r.trim());
    if (newRoles) {
      await updateRoles(user.id, newRoles);
      setRoles(newRoles);
      alert("Роли обновлены!");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Управление пользователем {user.username}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center"><Spinner className="w-8 h-8" /></div>
        ) : (
          <div className="space-y-4">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Роли:</strong> {roles.join(", ") || "Нет ролей"}</p>
            <Button onClick={() => sendEmailConfirmation(user.id)}>Подтвердить Email</Button>
            <Button onClick={() => resetPassword(user.id)}>Сброс пароля</Button>
            <Button onClick={handleChangeEmail}>Изменить Email</Button>
            <Button onClick={handleUpdateRoles}>Изменить Роли</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserActionsModal;