import { IUpdateRecipeForm } from '../../domain/api';
import { deleteRecipeMutation } from './deleteRecipeMutation';
import { addItemMutation } from './Hooks/useAddItemMutation';
import { checkItemMutation } from './Hooks/useCheckItemMutation';
import { deleteItemMutation } from './Hooks/useDeleteItemMutation';
import { updateRecipeImageMutation } from './updateRecipeImageMutation';
import { updateRecipeMutation } from './updateRecipeMutation';

function submitItem(name: string, tags: string[] = []) {
  return addItemMutation.mutate({ name, tags });
}

function checkItem(itemID: string, checked: boolean) {
  return checkItemMutation.mutate({ itemID, checked });
}

function deleteItem(itemID: string) {
  return deleteItemMutation.mutate(itemID);
}

function submitUpdateRecipe(recipe: IUpdateRecipeForm) {
  return updateRecipeMutation.mutate(recipe);
}

function submitDeleteRecipe(recipe_name: string) {
  return deleteRecipeMutation.mutate(recipe_name);
}

function submitUpdateRecipeImage(
  recipe_name: string,
  file: Blob | ArrayBuffer | Uint8Array<ArrayBufferLike>
) {
  return updateRecipeImageMutation.mutate({ recipe_name, file });
}
