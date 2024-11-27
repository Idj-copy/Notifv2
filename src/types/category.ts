export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isDefault?: boolean;
  subcategories?: SubCategory[];
}