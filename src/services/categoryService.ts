import {Category} from '../types/category';

const CUSTOM_CATEGORIES_KEY = 'sportify_custom_categories';
const DEFAULT_CATEGORIES_KEY = 'sportify_default_categories';

const defaultCategories: Category[] = [
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    isDefault: true
  },
  {
    id: 'f1',
    name: 'Formula 1',
    icon: '🏎️',
    isDefault: true
  },
  {
    id: 'mma',
    name: 'MMA',
    icon: '🥊',
    isDefault: true,
    subcategories: [
      { id: 'ufc', name: 'UFC' },
      { id: 'bellator', name: 'Bellator' }
    ]
  },
  {
    id: 'boxing',
    name: 'Boxing',
    icon: '🥊',
    isDefault: true
  }
];

// Initialiser les catégories par défaut si elles n'existent pas
const initializeDefaultCategories = () => {
  const stored = localStorage.getItem(DEFAULT_CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(DEFAULT_CATEGORIES_KEY, JSON.stringify(defaultCategories));
  }
};

export const getCategories = (): Category[] => {
  try {
    initializeDefaultCategories();

    const storedDefault = localStorage.getItem(DEFAULT_CATEGORIES_KEY);
    const storedCustom = localStorage.getItem(CUSTOM_CATEGORIES_KEY);

    const defaultCats = storedDefault ? JSON.parse(storedDefault) : [];
    const customCats = storedCustom ? JSON.parse(storedCustom) : [];

    return [...defaultCats, ...customCats];
  } catch (error) {
    console.error('Error reading categories:', error);
    return defaultCategories;
  }
};

export const saveCategory = (category: Omit<Category, 'id'>) => {
  const categories = getCustomCategories();
  const newCategory = {
    ...category,
    id: `custom-${Date.now()}`,
    isDefault: false
  };

  const updatedCategories = [...categories, newCategory];
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updatedCategories));
  return newCategory;
};

export const updateCategory = (categoryId: string, updates: Partial<Category>) => {
  const isDefault = categoryId.indexOf('custom-') === -1;
  const storageKey = isDefault ? DEFAULT_CATEGORIES_KEY : CUSTOM_CATEGORIES_KEY;

  const categories = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const updatedCategories = categories.map((cat: Category) =>
    cat.id === categoryId ? { ...cat, ...updates, isDefault } : cat
  );

  localStorage.setItem(storageKey, JSON.stringify(updatedCategories));
};

export const getCustomCategories = (): Category[] => {
  try {
    const categoriesJson = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return categoriesJson ? JSON.parse(categoriesJson) : [];
  } catch (error) {
    console.error('Error reading custom categories:', error);
    return [];
  }
};

export const deleteCategory = (categoryId: string) => {
  const categories = getCustomCategories();
  const updatedCategories = categories.filter(cat => cat.id !== categoryId);
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updatedCategories));
};
