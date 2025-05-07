import { useState } from "react";
import { useCategories } from "@/services/categoryService";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CategoryNode } from "@/types/CategoryNode";
import { CategoryRow } from "@/components/CategoryRow";
import EditCategoryModal from "@/components/EditCategoryModal";

const buildCategoryTree = (flatCategories: CategoryNode[]): CategoryNode[] => {
  const categoryMap = new Map<string, CategoryNode>();

  flatCategories.forEach((cat) => {
    categoryMap.set(cat.categoryName, { ...cat, children: [], expanded: true });
  });

  const roots: CategoryNode[] = [];

  flatCategories.forEach((cat) => {
    const node = categoryMap.get(cat.categoryName)!;
    if (cat.parentCategoryName) {
      const parent = categoryMap.get(cat.parentCategoryName);
      parent?.children?.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const Categories = () => {
  const { data, isLoading } = useCategories();
  const [treeData, setTreeData] = useState<CategoryNode[]>([]);
  const [pendingDrop, setPendingDrop] = useState<{
    source: CategoryNode;
    target: CategoryNode;
  } | null>(null);

  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (cat: CategoryNode) => {
    setEditingCategory(cat);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updated: CategoryNode) => {
    toast({ title: "Категория обновлена", description: updated.categoryName });

    const updateTree = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.map((node) => {
        if (node.categoryName === updated.categoryName) {
          return { ...node, categoryName: updated.categoryName };
        } else if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });

    setTreeData(updateTree(treeData));
  };

  useState(() => {
    if (data?.data) {
      const tree = buildCategoryTree(data.data);
      setTreeData(tree);
    }
  });

  const toggleExpand = (cat: CategoryNode) => {
    cat.expanded = !cat.expanded;
    setTreeData([...treeData]);
  };

  const handleDropRequest = (source: CategoryNode, target: CategoryNode) => {
    setPendingDrop({ source, target });
  };

  const confirmDrop = () => {
    if (!pendingDrop) return;

    const { source, target } = pendingDrop;

    toast({
      title: "Изменено",
      description: `${source.categoryName} теперь под категорией ${target.categoryName}`,
    });

    setPendingDrop(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Категории</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название категории</TableHead>
              <TableHead>Родительская</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treeData.map((cat) => (
              <CategoryRow
                key={cat.categoryName}
                category={cat}
                level={0}
                toggleExpand={toggleExpand}
                onEdit={handleEdit}
                onDropRequest={handleDropRequest}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {showEditModal && editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}

      {pendingDrop && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 w-[400px]">
            <h3 className="text-xl font-bold">Подтверждение</h3>
            <p>
              Вы действительно хотите переместить{" "}
              <strong>{pendingDrop.source.categoryName}</strong> под{" "}
              <strong>{pendingDrop.target.categoryName}</strong>?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setPendingDrop(null)}>
                Отмена
              </Button>
              <Button variant="primary" onClick={confirmDrop}>
                Подтвердить
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <p>Загрузка...</p>}
    </div>
  );
};
