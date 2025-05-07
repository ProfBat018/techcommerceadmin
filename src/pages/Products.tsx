import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setSearchQuery,
  clearSearchQuery,
} from "@/store/productSearchAutocompleteSlice";

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
import { ProductCount } from "@/components/ProductCount";
import { ArrowUpDown } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { mutate } from "swr";
import { getProductsKey, useProducts } from "@/hooks/useProducts";
import { useProductSearch } from "@/hooks/useProductSearch";

const Products = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchQuery = useSelector(
    (state: RootState) => state.productSearchAutocomplete.query
  );
  const { data: searchResults } = useProductSearch(searchQuery);

  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const [sortBy, setSortBy] = useState<string>("name");
  const [ascending, setAscending] = useState<boolean>(true);

  const { data, isValidating } = useProducts(
    page,
    pageSize,
    sortBy,
    ascending,
    ""
  ); 
  const swrKey = getProductsKey(page, pageSize, sortBy, ascending, "");

  const [showCreateModal, setShowCreateModal] = useState(false);

  useNotifications({
    on: {
      ProductCreated: (payload) => {
        console.log("🟢 Новый продукт:", payload);
        mutate(swrKey);
      },
      ProductUpdated: (payload) => {
        console.log("🔵 Обновление продукта:", payload);
        mutate(swrKey);
      },
    },
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setAscending(!ascending);
    } else {
      setSortBy(column);
      setAscending(true);
    }
    setPage(1);
  };

  const handleMoreInfo = (productId: string) => {
    navigate(`/dashboard/products/${productId}`);
    dispatch(clearSearchQuery());
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-2xl font-bold">Товары</h2>
        <div className="flex flex-col w-80 gap-2 relative">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="px-3 py-2 border rounded-md w-full"
          />
          {searchQuery && searchResults?.length > 0 && (
            <div className="absolute top-12 z-10 w-full bg-white border shadow-lg rounded-md max-h-60 overflow-y-auto">
              {searchResults.map((product: any) => (
                <div
                  key={product.productId}
                  onClick={() => handleMoreInfo(product.productId)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <img
                    src={product.imagePath}
                    alt={product.productName}
                    className="h-6 w-6 object-cover rounded"
                  />
                  <span>{product.productName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Добавить товар
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Изображение</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Название <ArrowUpDown className="inline w-4 h-4" />
              </TableHead>
              <TableHead>Описание</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Цена (AZN) <ArrowUpDown className="inline w-4 h-4" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("count")}
              >
                Количество <ArrowUpDown className="inline w-4 h-4" />
              </TableHead>
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
                <TableCell>
                  <ProductCount productId={product.id} />
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoreInfo(product.id)}
                  >
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
