import axios from 'axios';

export interface TagDTO {
  tag: string;
}

export interface ShoppingListItemDTO {
  id: number;
  checked: boolean;
  item_name: string;
  tags: TagDTO[];
}

export interface IShoppingListItem {
  id: string;
  name: string;
  checked: boolean;
  tags: string[];
}

export type ShoppingListDTO = ShoppingListItemDTO[];

export interface ITag {
  id: string;
  name: string;
}

// export type TShoppingList = IShoppingListItem[];
export interface IShoppingList {
  items: IShoppingListItem[];
}

export interface IRecipeDTO {
  created_at: string;
  id: string;
  image_url: string;
  recipe_name: string;
  recipe_preparation: string;
  ingredients: IIngredient[];
}

export interface IRecipe {
  createdAt: string;
  id: string;
  imageUrl: string;
  recipeName: string;
  recipePreparation: string;
  ingredients: string[];
}

export interface IAddRecipeForm {
  recipeName: string;
  recipePreparation: string;
  ingredients: string[];
  file: File;
}

export interface IUpdateRecipeForm {
  recipeName: string;
  recipePreparation: string;
  imageUrl: string;
  ingredients: string[];
}

export interface IIngredient {
  createdAt: string;
  exists: boolean;
  id: number;
  itemId: string;
  itemName: string;
  recipeId: string;
}
