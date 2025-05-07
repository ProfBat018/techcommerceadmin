import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { CategoryNode } from "@/types/CategoryNode";
import { TableCell, TableRow } from "./ui/table";
import { Button } from "./ui/button";

export const CategoryRow = ({
  category,
  level,
  toggleExpand,
  onEdit,
  onDropRequest,
}: {
  category: CategoryNode;
  level: number;
  toggleExpand: (category: CategoryNode) => void;
  onEdit: (category: CategoryNode) => void;
  onDropRequest: (source: CategoryNode, target: CategoryNode) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
  } = useDraggable({
    id: category.categoryName,
    data: category,
  });

  const { setNodeRef: dropRef, isOver } = useDroppable({
    id: category.categoryName,
  });

  return (
    <>
      <TableRow
        ref={dropRef}
        className={clsx({ "bg-muted": isOver })}
        onDrop={(e) => {
          e.preventDefault();
          const sourceId = e.dataTransfer.getData("text/plain");
          if (sourceId && sourceId !== category.categoryName) {
            onDropRequest(
              { categoryName: sourceId, parentCategoryName: null },
              category
            );
          }
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <TableCell className="flex items-center gap-2">
          <div
            style={{ marginLeft: `${level * 16}px` }}
            className="flex items-center gap-2"
            ref={dragRef}
            {...attributes}
            {...listeners}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", category.categoryName)
            }
          >
            {category.children && category.children.length > 0 && (
              <button onClick={() => toggleExpand(category)}>
                {category.expanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}
            <span>{category.categoryName}</span>
            <Pencil
              size={14}
              className="cursor-pointer opacity-60 hover:opacity-100"
              onClick={() => onEdit(category)}
            />
          </div>
        </TableCell>
        <TableCell>{category.parentCategoryName || "—"}</TableCell>
        <TableCell>
          <Button size="sm" variant="destructive">
            Удалить
          </Button>
        </TableCell>
      </TableRow>
      {category.expanded &&
        category.children?.map((child) => (
          <CategoryRow
            key={child.categoryName}
            category={child}
            level={level + 1}
            toggleExpand={toggleExpand}
            onEdit={onEdit}
            onDropRequest={onDropRequest}
          />
        ))}
    </>
  );
};
