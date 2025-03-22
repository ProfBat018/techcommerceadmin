import { useEffect, useMemo, useState } from "react";
import { useCategories, CategoryDTO } from "@/services/categoryService";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  onChange: (selected: string[]) => void;
}

export const CategorySelector = ({ onChange }: Props) => {
  const { data, isLoading } = useCategories();
  const [selected, setSelected] = useState<string[]>([]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, { name: string; parent: string | null }>();
    data?.data.forEach((c) =>
      map.set(c.categoryName, {
        name: c.categoryName,
        parent: c.parentCategoryName || null,
      })
    );
    return map;
  }, [data]);

  const tree = useMemo(() => {
    const roots: Record<string | null, string[]> = {};
    const result: CategoryDTO[] = data?.data ?? [];

    result.forEach(({ categoryName, parentCategoryName }) => {
      const parent = parentCategoryName || null;
      if (!roots[parent]) roots[parent] = [];
      roots[parent].push(categoryName);
    });

    const buildTree = (name: string, level: number = 0): JSX.Element => (
      <li key={name} className={`ml-${level * 4}`}>
        <label className="flex items-center gap-2 py-1">
          <Checkbox
            checked={selected.includes(name)}
            onCheckedChange={() => toggleCategory(name)}
          />
          {name}
        </label>
        {roots[name] && (
          <ul>{roots[name].map((child) => buildTree(child, level + 1))}</ul>
        )}
      </li>
    );

    return roots[null]?.map((name) => buildTree(name)) || null;
  }, [data, selected]);

  const toggleCategory = (name: string) => {
    const updated = new Set(selected);

    const addParents = (child: string) => {
      const parent = categoryMap.get(child)?.parent;
      if (parent && !updated.has(parent)) {
        updated.add(parent);
        addParents(parent);
      }
    };

    if (updated.has(name)) {
      updated.delete(name);
    } else {
      updated.add(name);
      addParents(name);
    }

    const list = Array.from(updated);
    setSelected(list);
    onChange(list);
  };

  if (isLoading) return <Spinner className="w-6 h-6" />;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Категории
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            Выбрать категории
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 max-h-72 overflow-y-auto px-2 py-2 space-y-1">
          <ul className="space-y-1">{tree}</ul>
        </DropdownMenuContent>
      </DropdownMenu>
      {selected.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Выбрано: {selected.join(", ")}
        </div>
      )}
    </div>
  );
};