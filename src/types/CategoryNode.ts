export interface CategoryNode {
    name: string;
    children: CategoryNode[];
    parent?: CategoryNode;
  }