import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductDTO } from "@/types/ProductDTO";
import { updateProduct } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

interface ProductEditModalProps {
  product: ProductDTO;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (updatedProduct: ProductDTO) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  isOpen,
  onClose,
  onProductUpdated,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductDTO>(product);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedProduct = await updateProduct(product.id, formData, image);
      onProductUpdated(updatedProduct);
      toast({ title: "Товар успешно обновлён!" });
      setTimeout(() => {
        navigate(0); // Полностью перезагружаем страницу для обновления данных
      }, 1000);
    } catch (error) {
      toast({ title: "Ошибка обновления товара!", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-xl shadow-xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Редактирование товара
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Название"
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <Input
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="Описание"
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Цена"
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? <Spinner className="w-5 h-5" /> : "Сохранить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
