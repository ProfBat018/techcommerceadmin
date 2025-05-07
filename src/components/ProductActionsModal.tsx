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
import { updateProduct, getProductCountById } from "@/services/productService";
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
  const [count, setCount] = useState<number>(0);
  const [showZeroWarning, setShowZeroWarning] = useState(false);

  useEffect(() => {
    if (!product?.id) return;

    setFormData(product);

    const fetchCount = async () => {
      try {
        const response = await getProductCountById(product.id);
        console.log("count", response);
        setCount(response.data); 
      } catch (error) {
        toast({
          title: "Ошибка загрузки количества товара",
          variant: "destructive",
        });
      }
    };

    fetchCount();
  }, [product?.id]); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const updated = await updateProduct(
        product.id,
        formData,
        count,
        image || undefined
      );
      onProductUpdated(updated);
      toast({ title: "Товар успешно обновлён!" });
      setTimeout(() => navigate(0), 1000);
    } catch {
      toast({ title: "Ошибка обновления товара!", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedProduct = await updateProduct(
        product.id,
        formData,
        count,
        image
      );
      onProductUpdated(updatedProduct);
      toast({ title: "Товар успешно обновлён!" });


      setTimeout(() => {
        setLoading(false);
        onClose();

      }, 1000);
    } catch (error) {
      setLoading(false);
      toast({ title: "Ошибка обновления товара!", variant: "destructive" });
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
          />
          <Input
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="Описание"
          />
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Цена"
          />
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">
              Количество на складе
            </label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              min={0}
              className="w-32"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? <Spinner className="w-5 h-5" /> : "Сохранить"}
          </Button>
        </div>

        <Dialog open={showZeroWarning} onOpenChange={setShowZeroWarning}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Внимание</DialogTitle>
            </DialogHeader>
            <p className="text-gray-700 dark:text-gray-300">
              Количество установлено в 0. Товар станет недоступным. Продолжить?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowZeroWarning(false)}
              >
                Отмена
              </Button>
              <Button variant="destructive" onClick={saveChanges}>
                Да, продолжить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
