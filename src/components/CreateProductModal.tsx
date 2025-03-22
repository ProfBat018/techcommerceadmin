import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/components/CategorySelector";

interface CreateProductModalProps {
  onClose: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ onClose }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSubmit = () => {
    // Здесь отправка данных на API
    console.log({ productName, description, price, selectedCategories });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-xl shadow-xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Добавить товар
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Название товара"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
          />

          <CategorySelector onChange={setSelectedCategories} />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;
