// components/ProductCount.tsx

import { Spinner } from "@/components/ui/spinner";
import { useProductCount } from "@/hooks/useProductCount";

export const ProductCount = ({ productId }: { productId: string }) => {
  const { data, isLoading } = useProductCount(productId);

  if (isLoading) {
    return <Spinner className="w-4 h-4" />;
  }

  return (
    <span className="font-medium text-gray-800 dark:text-gray-100">{data}</span>
  );
};
