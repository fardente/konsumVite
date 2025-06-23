import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getBlob, getStorage, ref, uploadBytes } from 'firebase/storage';
import { COLLECTION_PREFIX, db } from '../firebase';
import { IAddRecipeForm } from './interfaces';
import { Recipe, RecipeConverter } from './recipe';
import { ShoppingItem, ShoppingItemConverter } from './shoppingItem';

const RECIPE_COLLECTION = COLLECTION_PREFIX + 'recipes';
const SHOPPING_ITEMS_COLLECTION = COLLECTION_PREFIX + 'items';
export const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/1280x960';

export async function fetchShoppingItems(): Promise<ShoppingItem[]> {
  console.log('Fetching shopping items');
  try {
    const items = await getDocs(
      query(
        collection(db, SHOPPING_ITEMS_COLLECTION).withConverter(
          ShoppingItemConverter
        ),
        orderBy('checked'),
        orderBy('updated', 'desc'),
        where('onList', '==', true)
      )
    );
    console.log('Fetched shopping items:', items.docs);
    const res = items.docs.map(doc => doc.data());
    console.log('Shopping items data:', res);
    return res as ShoppingItem[];
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    throw error; // rethrow the error to handle it in the calling function
  }
}

export async function addShoppingItem(name: string) {
  console.log('Adding shopping item', name);
  const shoppingItem = new ShoppingItem(name);
  await setDoc(
    doc(db, SHOPPING_ITEMS_COLLECTION, name).withConverter(
      ShoppingItemConverter
    ),
    shoppingItem,
    {
      merge: true,
    }
  );
}

export async function addMultipleShoppingItems(names: string[]) {
  const results = await Promise.allSettled(
    names.map(item => {
      const shoppingItem = new ShoppingItem(item);
      return setDoc(
        doc(db, SHOPPING_ITEMS_COLLECTION, item).withConverter(
          ShoppingItemConverter
        ),
        shoppingItem
      );
    })
  );
  const successes: string[] = [];
  const failures: { value: string; reason: unknown }[] = [];

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      successes.push(names[i]);
    } else {
      failures.push({ value: names[i], reason: result.reason });
    }
  });

  return { successes, failures };
}

export async function checkShoppingItem(id: string, checked: boolean) {
  await updateDoc(doc(db, SHOPPING_ITEMS_COLLECTION, id), {
    checked,
    updated: serverTimestamp(),
  });
}

export async function deleteShoppingItem(id: string) {
  // await deleteDoc(doc(db, 'items', id));
  await updateDoc(doc(db, SHOPPING_ITEMS_COLLECTION, id), {
    onList: false,
    updated: serverTimestamp(),
  });
}

export async function addTagToShoppingItem(id: string, tag: string) {
  tag = tag.toLowerCase().trim();
  return await updateDoc(doc(db, SHOPPING_ITEMS_COLLECTION, id), {
    tags: arrayUnion(tag),
  });
}

export async function removeTagFromShoppingItem(itemId: string, tag: string) {
  console.log('Removing tagfunc', itemId, tag);
  const s = new Set(['asd', 'qwe', 'zxc']);
  s.entries();
  return await updateDoc(doc(db, SHOPPING_ITEMS_COLLECTION, itemId), {
    tags: arrayRemove(tag),
  });
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const recipes = await getDocs(
    query(collection(db, RECIPE_COLLECTION), orderBy('updated', 'desc'))
  );
  return Promise.all(
    recipes.docs.map(async doc => {
      const recipe = doc.data();
      let objectURL: string | undefined = undefined;
      if (recipe.imageUrl !== '') {
        console.log('Fetching image for recipe', recipe.imageUrl);
        try {
          const storage = getStorage();
          const storageRef = ref(storage, recipe.imageUrl);
          const imageBlob = await getBlob(storageRef);
          objectURL = URL.createObjectURL(imageBlob);
        } catch (error: any) {
          if (error.code === 'storage/object-not-found') {
            console.warn('Image not found in storage for recipe:', recipe.id);
            objectURL = PLACEHOLDER_IMAGE_URL;
          } else {
            throw error; // rethrow if it's a different error
          }
        }
      }
      return new Recipe(
        recipe.name,
        recipe.recipePreparation,
        recipe.ingredients,
        objectURL
      );
    })
  );
}

export async function fetchRecipe(
  recipe_query: string
): Promise<Recipe | undefined> {
  const recipeDoc = await getDoc(
    doc(db, RECIPE_COLLECTION, recipe_query).withConverter(RecipeConverter)
  );
  if (!recipeDoc.exists()) return undefined;

  const recipe = recipeDoc.data();
  let objectURL: string = PLACEHOLDER_IMAGE_URL;

  console.log('Fetching recipe', recipe_query);
  console.log('Recipe data:', recipe);

  if (recipe.imageUrl) {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, recipe.imageUrl);
      const imageBlob = await getBlob(storageRef);
      console.log('Fetching image for recipe', recipe_query);
      objectURL = URL.createObjectURL(imageBlob);
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn(
          `Image ${recipe.imageUrl} not found in storage for recipe ${recipe_query}`
        );
        objectURL = PLACEHOLDER_IMAGE_URL; // or set to a placeholder URL if you prefer
      } else {
        throw error; // rethrow if it's a different error
      }
    }
  }
  return new Recipe(
    recipe.name,
    recipe.recipePreparation,
    recipe.ingredients,
    objectURL
  );
}

export async function addRecipe(recipe: IAddRecipeForm) {
  console.log('Adding recipe', recipe);
  let imageUrl: string = COLLECTION_PREFIX + recipe.name;

  if (!recipe.file || !('size' in recipe.file) || recipe.file.size === 0) {
    console.error('No file provided for recipe image upload');
    imageUrl = '';
  } else {
    const storage = getStorage();
    const storageRef = ref(storage, COLLECTION_PREFIX + recipe.name);
    uploadBytes(storageRef, recipe.file).then(snapshot => {
      console.log('Uploaded a blob or file!');
    });
  }

  await setDoc(doc(db, RECIPE_COLLECTION, recipe.name), {
    id: recipe.name,
    name: recipe.name,
    ingredients: [...recipe.ingredients],
    recipePreparation: recipe.recipePreparation,
    imageUrl,
    updated: serverTimestamp(),
  });
}

export async function updateRecipe(recipe: Recipe) {
  await updateDoc(doc(db, RECIPE_COLLECTION, recipe.name), {
    id: recipe.name,
    name: recipe.name,
    ingredients: [...recipe.ingredients.map(ingredient => ingredient.trim())],
    recipePreparation: recipe.recipePreparation,
    imageUrl: COLLECTION_PREFIX + recipe.name,
    updated: serverTimestamp(),
  });
}

export async function deleteRecipe(id: string) {
  console.log('deleting recipe', id);
  await deleteDoc(doc(db, RECIPE_COLLECTION, id));
  // TODO : delete image from storage
}

export async function updateRecipeImage(
  recipe_name: string,
  file: Blob | Uint8Array | ArrayBuffer
) {
  const storage = getStorage();
  const storageRef = ref(storage, COLLECTION_PREFIX + recipe_name);

  uploadBytes(storageRef, file).then(snapshot => {
    console.log('Uploaded a blob or file!');
  });
}

export async function fetchSuggestions(
  input: string,
  onlyOnList: boolean = false
): Promise<string[]> {
  if (!input.trim()) {
    console.log('No input provided for suggestions');
    return [];
  }
  const base = query(
    collection(db, SHOPPING_ITEMS_COLLECTION),
    orderBy('name'),
    startAt(input),
    endAt(`${input}\uf8ff`)
  );

  const q = onlyOnList ? query(base, where('onList', '==', false)) : base;

  const querySnapshot = await getDocs(q);
  const res = querySnapshot.docs.map(doc => ({
    ...doc.data(),
  })) as ShoppingItem[];

  return res.map(item => item.name);
}
