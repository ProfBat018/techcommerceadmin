
export type CategoryNode = {
  categoryName: string;
  parentCategoryName: string | null;
  children?: CategoryNode[];
  expanded?: boolean;
};