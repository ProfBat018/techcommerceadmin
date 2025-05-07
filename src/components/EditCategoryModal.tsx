import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CategoryNode } from "@/types/CategoryNode";

type Props = {
  category: CategoryNode;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCategory: CategoryNode) => void;
};

const EditCategoryModal = ({ category, isOpen, onClose, onSave }: Props) => {
  const [name, setName] = useState(category.categoryName);

  useEffect(() => {
    setName(category.categoryName);
  }, [category]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSave({ ...category, categoryName: name });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Название категории
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите новое название"
          />
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
