import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { ProductDTO } from "../types/ProductDTO";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import ProductEditModal from "@/components/ProductEditModal";

const ProductDetails = () => {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(id);
        setProduct(data.data);
      } catch (error) {
        toast({ title: "Ошибка загрузки данных!", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleProductUpdated = (updatedProduct: ProductDTO) => {
    setProduct(updatedProduct);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-red-500">Товар не найден</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="secondary"
        className="mb-4"
        onClick={() => navigate(`/dashboard/products`)}
      >
        Назад
      </Button>
      <div className="flex gap-6 items-start">
        <img
          src={product.imagePath}
          alt={product.productName}
          className="w-80 h-80 rounded-lg object-cover shadow-lg"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {product.productName}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {product.productDescription}
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {typeof product.price === "number"
              ? product.price.toLocaleString("az-AZ", {
                  style: "currency",
                  currency: "AZN",
                })
              : "—"}
          </p>
          <Button
            variant="primary"
            className="mt-4 w-40"
            onClick={() => setIsEditModalOpen(true)}
          >
            Редактировать
          </Button>
        </div>
      </div>
      <ProductEditModal
        product={product}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
};

export default ProductDetails;
