import { useState } from "react";
import { useProducts } from "../services/productService";
import { ProductDTO } from "../types/ProductDTO";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import CreateProductModal from "@/components/CreateProductModal";

const Products = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const { data, isValidating } = useProducts(page, pageSize);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleMoreInfo = (productId: string) => {
    navigate(`/dashboard/products/${productId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Товары</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Добавить товар
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Цена (AZN)</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((product: ProductDTO, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    src={product.imagePath}
                    alt={product.productName}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productDescription}</TableCell>
                <TableCell>
                  {product.price.toLocaleString("az-AZ", {
                    style: "currency",
                    currency: "AZN",
                  })}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleMoreInfo(product.id)}>
                    Узнать больше
                  </Button>
                  <Button size="sm" variant="destructive">
                    Удалить
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

      {showCreateModal && (
        <CreateProductModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Products;
