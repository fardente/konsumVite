import { FieldValue } from 'firebase/firestore';

// export interface IShoppingListItem {
//   name: string;
//   name_lowercase: string;
//   onList: boolean;
//   checked: boolean;
//   tags: Set<string>;
// }

export interface IRecipe {
  createdAt: string;
  id: string;
  imageUrl: string;
  recipeName: string;
  recipePreparation: string;
  ingredients: string[];
}

export interface IAddRecipeForm {
  name: string;
  recipePreparation: string;
  ingredients: string[];
  file: File;
}

export interface IIngredient {
  createdAt: string;
  exists: boolean;
  id: number;
  itemId: string;
  itemName: string;
  recipeId: string;
}
