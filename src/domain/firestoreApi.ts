import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
import { COLLECTION_PREFIX, db, loadStorage } from '../firebase';
import { IAddRecipeForm } from './interfaces';
import { Recipe, RecipeConverter } from './recipe';
import { ShoppingItem, ShoppingItemConverter } from './shoppingItem';

// Image compression is only needed when uploading recipe images; load it on
// demand instead of in the initial bundle.
const loadImageCompression = () => import('../imagecompression');

const RECIPE_COLLECTION = COLLECTION_PREFIX + 'recipes';
const SHOPPING_ITEMS_COLLECTION = COLLECTION_PREFIX + 'items';
export const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/1280x960';

const shoppingItemsQuery = () =>
  query(
    collection(db, SHOPPING_ITEMS_COLLECTION).withConverter(
      ShoppingItemConverter
    ),
    orderBy('checked'),
    orderBy('updated', 'desc'),
    where('onList', '==', true)
  );

/**
 * Live subscription to the shopping list. Fires first with the locally cached
 * items (fast app start), then again with server data and on every change.
 */
export function subscribeShoppingItems(
  onItems: (items: ShoppingItem[]) => void
): () => void {
  return onSnapshot(
    shoppingItemsQuery(),
    snapshot => onItems(snapshot.docs.map(doc => doc.data())),
    error => console.error('Shopping items listener failed:', error)
  );
}

export async function fetchShoppingItems(): Promise<ShoppingItem[]> {
  try {
    const items = await getDocs(shoppingItemsQuery());
    const res = items.docs.map(doc => doc.data());
    return res as ShoppingItem[];
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    throw error; // rethrow the error to handle it in the calling function
  }
}

export async function addShoppingItem(name: string) {
  const shoppingItem = new ShoppingItem(name);
  await setDoc(
    doc(db, SHOPPING_ITEMS_COLLECTION, name.trim().toLowerCase()).withConverter(
      ShoppingItemConverter
    ),
    shoppingItem,
    {
      merge: true,
    }
  );
}

export async function addMultipleShoppingItems(items: ShoppingItem[]) {
  const results = await Promise.allSettled(
    items.map(shoppingItem => {
      return setDoc(
        doc(
          db,
          SHOPPING_ITEMS_COLLECTION,
          shoppingItem.name_lowercase
        ).withConverter(ShoppingItemConverter),
        shoppingItem,
        {
          merge: true,
        }
      );
    })
  );
  const successes: string[] = [];
  const failures: { value: string; reason: unknown }[] = [];

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      successes.push(items[i].name);
    } else {
      failures.push({ value: items[i].name, reason: result.reason });
    }
  });

  return { successes, failures };
}

export async function checkShoppingItem(id: string, checked: boolean) {
  await updateDoc(doc(db, SHOPPING_ITEMS_COLLECTION, id.trim().toLowerCase()), {
    checked,
    updated: serverTimestamp(),
  });
}

export async function deleteShoppingItem(id: string) {
  // await deleteDoc(doc(db, 'items', id));
  await updateDoc(doc(db, SHOPPING_ITEMS_COLLECTION, id.trim().toLowerCase()), {
    onList: false,
    updated: serverTimestamp(),
  });
}

export async function addTagToShoppingItem(id: string, tag: string) {
  tag = tag.toLowerCase().trim();
  return await updateDoc(
    doc(db, SHOPPING_ITEMS_COLLECTION, id.trim().toLowerCase()),
    {
      tags: arrayUnion(tag),
    }
  );
}

export async function removeTagFromShoppingItem(itemId: string, tag: string) {
  return await updateDoc(
    doc(db, SHOPPING_ITEMS_COLLECTION, itemId.trim().toLowerCase()),
    {
      tags: arrayRemove(tag),
    }
  );
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const recipes = await getDocs(
    query(collection(db, RECIPE_COLLECTION), orderBy('updated', 'desc'))
  );
  return Promise.all(
    recipes.docs.map(async doc => {
      const recipe = doc.data();
      let objectURL: string | undefined = undefined;
      let imageUrl = recipe.imageThumbnailUrl || recipe.imageUrl;
      if (imageUrl !== '') {
        try {
          const { storage, ref, getBlob } = await loadStorage();
          const storageRef = ref(storage, imageUrl);
          const imageBlob = await getBlob(storageRef);
          objectURL = URL.createObjectURL(imageBlob);
        } catch (error: any) {
          if (error.code) {
            console.warn(
              'Image not found in storage for recipe:',
              recipe.id,
              recipe.imageUrl,
              error
            );
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
        '',
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

  if (recipe.imageUrl) {
    try {
      const { storage, ref, getBlob } = await loadStorage();
      const storageRef = ref(storage, recipe.imageUrl);
      const imageBlob = await getBlob(storageRef);
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
  let imageUrl: string = COLLECTION_PREFIX + recipe.name;
  let imageThumbnailUrl = imageUrl + '-thumbnail';

  if (!recipe.file || !('size' in recipe.file) || recipe.file.size === 0) {
    console.error('No file provided for recipe image upload');
    imageUrl = '';
    imageThumbnailUrl = '';
  } else {
    const [{ storage, ref, uploadBytes }, { compressImage, generateThumbnail }] =
      await Promise.all([loadStorage(), loadImageCompression()]);
    const storageRef = ref(storage, COLLECTION_PREFIX + recipe.name);
    const compressedImage = await compressImage(recipe.file);
    const file = compressedImage ? compressedImage : recipe.file;
    uploadBytes(storageRef, file).then(snapshot => {
      console.log('Uploaded a blob or file!');
    });
    const thumbnailRef = ref(storage, imageThumbnailUrl);
    let thumbnailFile = await generateThumbnail(file);
    thumbnailFile = thumbnailFile ? thumbnailFile : file;
    uploadBytes(thumbnailRef, thumbnailFile).then(snapshot => {
      console.log('Uploaded a blob or file!');
    });
  }

  await setDoc(doc(db, RECIPE_COLLECTION, recipe.name), {
    id: recipe.name,
    name: recipe.name,
    ingredients: [...recipe.ingredients],
    recipePreparation: recipe.recipePreparation,
    imageUrl,
    imageThumbnailUrl,
    updated: serverTimestamp(),
  });
}

export async function updateRecipe(recipe: Recipe) {
  await updateDoc(doc(db, RECIPE_COLLECTION, recipe.name), {
    id: recipe.name,
    name: recipe.name,
    ingredients: [...recipe.ingredients.map(ingredient => ingredient.trim())],
    recipePreparation: recipe.recipePreparation,
    updated: serverTimestamp(),
  });
}

export async function deleteRecipe(id: string) {
  await deleteDoc(doc(db, RECIPE_COLLECTION, id));
  // TODO : delete image from storage
}

export async function updateRecipeImage(recipe_name: string, file: File) {
  const [{ storage, ref, uploadBytes }, { compressImage, generateThumbnail }] =
    await Promise.all([loadStorage(), loadImageCompression()]);
  const storageRef = ref(storage, COLLECTION_PREFIX + recipe_name);
  const compressedImage = await compressImage(file);
  file = compressedImage ? compressedImage : file;

  uploadBytes(storageRef, file).then(snapshot => {
    console.log('Uploaded a blob or file!');
  });
  let thumbnailFile = await generateThumbnail(file);
  thumbnailFile = thumbnailFile ? thumbnailFile : file;
  let imageThumbnailUrl = COLLECTION_PREFIX + recipe_name + '-thumbnail';
  const thumbnailRef = ref(storage, imageThumbnailUrl);
  uploadBytes(thumbnailRef, thumbnailFile).then(snapshot => {
    console.log('Uploaded a blob or file!');
  });
  await updateDoc(doc(db, RECIPE_COLLECTION, recipe_name), {
    imageUrl: COLLECTION_PREFIX + recipe_name,
    imageThumbnailUrl,
    updated: serverTimestamp(),
  });
}

export async function fetchSuggestions(
  input: string,
  onlyOnList: boolean = false
): Promise<string[]> {
  if (!input.trim()) {
    return [];
  }
  input = input.toLowerCase().trim();

  const base = query(
    collection(db, SHOPPING_ITEMS_COLLECTION),
    orderBy('name_lowercase'),
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
