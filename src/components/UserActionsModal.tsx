import { useEffect, useState } from "react";
import {
  getUserRoles,
  emailConfirmation,
  resetPassword,
  changeEmail,
  updateRoles,
  getRoles,
  removeRole,
  deleteUser,
} from "../services/userService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserDTO } from "@/types/UserDTO";
import { Badge } from "@/components/ui/badge";
import { RoleCombobox } from "@/components/ui/rolecombobox";
import { RoleRequestDTO } from "@/services/requests";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface UserActionsModalProps {
  user: UserDTO;
  onClose: () => void;
}

const UserActionsModal: React.FC<UserActionsModalProps> = ({
  user,
  onClose,
}) => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user.email);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      const userRoles = await getUserRoles(user.id);
      const availableRoles = await getRoles();
      setRoles(userRoles.data.roles);
      setAllRoles(
        availableRoles.filter(
          (role) =>
            !userRoles.data.roles.includes(role) && role !== "SuperAdmin"
        )
      );
      setLoading(false);
    };

    loadRoles();
  }, [user.id]);

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user.email) return;
    await changeEmail(user.id, newEmail);
    toast({ title: "Email успешно обновлён!" });
    setIsEditingEmail(false);
  };

  const handleAddRole = async (selectedRole: string) => {
    if (selectedRole === "SuperAdmin") {
      toast({
        title: "Нельзя назначить нового SuperAdmin.",
        variant: "destructive",
      });
      return;
    }
    const roleRequest: RoleRequestDTO = {
      id: user.id,
      roleName: selectedRole,
    };
    await updateRoles(roleRequest);
    setRoles([...roles, selectedRole]);
    setAllRoles(allRoles.filter((role) => role !== selectedRole));
    toast({ title: "Роль добавлена!" });
  };

  const handleRemoveRole = async (roleToRemove: string) => {
    if (roleToRemove === "SuperAdmin") {
      toast({
        title: "Нельзя удалить роль SuperAdmin.",
        variant: "destructive",
      });
      return;
    }
    const roleRequest: RoleRequestDTO = {
      id: user.id,
      roleName: roleToRemove,
    };
    await removeRole(roleRequest);
    setRoles(roles.filter((role) => role !== roleToRemove));
    setAllRoles([...allRoles, roleToRemove]);
    toast({ title: "Роль удалена!" });
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id);
      toast({ title: "Пользователь удалён." });
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      toast({ title: "Ошибка при удалении", variant: "destructive" });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-xl shadow-xl bg-white dark:bg-gray-900">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Управление пользователем
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="w-12 h-12" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {user.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Роли
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <Badge
                      key={role}
                      className="flex items-center gap-2 px-2 py-1"
                    >
                      {role}
                      {role !== "SuperAdmin" && (
                        <button onClick={() => handleRemoveRole(role)}>
                          <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Нет ролей
                  </p>
                )}
              </div>
              <RoleCombobox options={allRoles} onChange={handleAddRole} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => emailConfirmation(user.id)}
                variant="outline"
              >
                Подтвердить Email
              </Button>
              <Button
                onClick={() => resetPassword(user.id)}
                variant="destructive"
              >
                Сброс пароля
              </Button>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Изменение Email
              </h3>
              {isEditingEmail ? (
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Введите новый email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <Button onClick={handleUpdateEmail} variant="primary">
                    Сохранить
                  </Button>
                  <Button
                    onClick={() => setIsEditingEmail(false)}
                    variant="secondary"
                  >
                    Отмена
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditingEmail(true)}>
                  Изменить Email
                </Button>
              )}
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
              >
                Удалить пользователя
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Подтвердите удаление
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300">
            Вы уверены, что хотите удалить пользователя{" "}
            <strong>{user.username}</strong>? Это действие необратимо.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default UserActionsModal;
