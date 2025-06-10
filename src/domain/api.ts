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

function mapTagDTO(tagDTO: TagDTO): Tag {
  return new Tag(tagDTO.tag_id, tagDTO.tag_name);
}

function mapShoppingListItemDTO(
  shoppingListItemDTO: ShoppingListItemDTO
): IShoppingListItem {
  return {
    id: String(shoppingListItemDTO.id),
    name: shoppingListItemDTO.item_name,
    checked: shoppingListItemDTO.checked,
    tags: shoppingListItemDTO.tags.map(tag => mapTagDTO(tag)),
  };
}

function mapShoppingListDTO(
  shoppingListDTO: ShoppingListDTO
): IShoppingListItem[] {
  return shoppingListDTO.map(item => mapShoppingListItemDTO(item));
}

export interface ITag {
  id: string;
  name: string;
}

// export type TShoppingList = IShoppingListItem[];
export interface IShoppingList {
  items: IShoppingListItem[];
}

export async function fetchShoppingItems(): Promise<IShoppingListItem[]> {
  const { data }: { data: ShoppingListDTO } = await axios.get(
    'http://localhost:3000/api/shopping/items'
  );
  return mapShoppingListDTO(data);
}

export function addShoppingItem(name: string) {
  name = name.trim();
  return axios.post('http://localhost:3000/api/shopping/add', {
    newItem: name,
  });
}

export function checkShoppingItem(id: string, checked: boolean) {
  return axios.put('http://localhost:3000/api/shopping/check', {
    id,
    checked,
  });
}

export function deleteShoppingItem(itemID: string) {
  return axios.post('http://localhost:3000/api/shopping/delete', {
    id: itemID,
  });
}

export function addTagToShoppingItem(itemID: string, tagName: string) {
  return axios.post('http://localhost:3000/api/tags', {
    tag_name: tagName,
    shopping_item_id: itemID,
  });
}
export function removeTagFromShoppingItem(itemID: string, tagID: string) {
  return axios.post('http://localhost:3000/api/tags/remove', {
    shopping_item_id: itemID,
    tag_id: tagID,
  });
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

function mapRecipeDTO(recipe: IRecipeDTO): IRecipe {
  return {
    ...recipe,
    createdAt: recipe.created_at,
    imageUrl: recipe.image_url,
    recipeName: recipe.recipe_name,
    recipePreparation: recipe.recipe_preparation,
    ingredients: recipe.ingredients,
  };
}

export async function fetchRecipes(): Promise<IRecipe[]> {
  const { data }: { data: IRecipeDTO[] } = await axios.get(
    'http://localhost:3000/api/recipes'
  );

  return data.map(recipe => mapRecipeDTO(recipe));
}

// export async function fetchRecipe(id: string): Promise<IRecipe> {
//   const { data }: { data: IRecipeDTO[] } = await axios.get(
//     'http://localhost:3000/api/recipes/' + id
//   );
//   if (data.length < 1) throw new Error();
//   return mapRecipeDTO(data[0]);
// }

export async function addRecipe(formData: EventTarget) {
  const response = await axios.post(
    'http://localhost:3000/api/recipes/add',
    formData
  );
  return response;
}

export async function updateRecipe(formData: EventTarget) {
  const response = await axios.put(
    'http://localhos:3000/api/recipes',
    formData
  );
  return response;
}

export async function addIngredientsToShoppingList(ingredientIds: EventTarget) {
  const response = await axios.post(
    'http://localhost:3000/api/recipes/buy',
    ingredientIds
  );
  return response;
}
