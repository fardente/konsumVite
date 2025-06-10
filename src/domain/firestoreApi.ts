import {
  addDoc,
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
import { db } from '../firebase';
import {
  IAddRecipeForm,
  IRecipe,
  IShoppingListItem,
  IUpdateRecipeForm,
} from './api';

async function firetest() {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    });
    console.log('Document written with ID: ', docRef.id);
    const querySnapshot = await getDocs(collection(db, 'ter'));
    querySnapshot.forEach(doc => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function fetchShoppingItems(): Promise<IShoppingListItem[]> {
  console.log('Fetching shopping items');
  try {
    const items = await getDocs(
      query(
        collection(db, 'items'),
        orderBy('updated', 'desc'),
        where('onList', '==', true)
      )
    );
    console.log('Fetched shopping items:', items.docs.length);
    return items.docs.map(doc => {
      return { ...doc.data(), name: doc.id } as IShoppingListItem;
    });
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    throw error; // rethrow the error to handle it in the calling function
  }
}

export interface IAddShoppingItem {
  name: string;
  tags: string[];
}
export async function addShoppingItem({ name, tags = [] }: IAddShoppingItem) {
  name = name.toLowerCase().trim();
  tags = tags.map(tag => tag.toLowerCase().trim());
  await setDoc(
    doc(db, 'items', name),
    {
      id: name,
      onList: true,
      checked: false,
      name,
      tags,
      updated: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function addMultipleShoppingItems(items: IAddShoppingItem[]) {
  const results = await Promise.allSettled(
    items.map(item => {
      return setDoc(doc(db, 'items', item.name), {
        id: item.name,
        onList: true,
        checked: false,
        name: item.name,
        tags: item.tags.map(tag => tag.toLowerCase().trim()) || [],
        updated: serverTimestamp(),
      });
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
  await updateDoc(doc(db, 'items', id), {
    checked,
    updated: serverTimestamp(),
  });
}

export async function deleteShoppingItem(id: string) {
  // await deleteDoc(doc(db, 'items', id));
  await updateDoc(doc(db, 'items', id), {
    onList: false,
    updated: serverTimestamp(),
  });
}

export async function addTagToShoppingItem(id: string, tag: string) {
  tag = tag.toLowerCase().trim();
  return await updateDoc(doc(db, 'items', id), { tags: arrayUnion(tag) });
}

export async function removeTagFromShoppingItem(itemId: string, tag: string) {
  return await updateDoc(doc(db, 'items', itemId), { tags: arrayRemove(tag) });
}

export async function fetchRecipes(): Promise<IRecipe[]> {
  const recipes = await getDocs(
    query(collection(db, 'recipes'), orderBy('updated', 'desc'))
  );
  return Promise.all(
    recipes.docs.map(async doc => {
      const recipe = doc.data();
      let objectURL: string | undefined = undefined;
      if (recipe.imageUrl !== '') {
        console.log('Fetching image for recipe', doc.data().imageUrl);
        const storage = getStorage();
        const storageRef = ref(storage, doc.data().imageUrl);
        const imageBlob = await getBlob(storageRef);
        objectURL = URL.createObjectURL(imageBlob);
      }
      return {
        ...recipe,
        recipeName: recipe.id,
        imageUrl: objectURL ?? '',
      } as IRecipe;
    })
  );
}

export async function fetchRecipe(
  recipe_query: string
): Promise<IRecipe | undefined> {
  const recipe = await getDoc(doc(db, 'recipes', recipe_query));
  if (!recipe.exists()) return undefined;
  console.log('Fetching recipe', recipe_query);
  console.log('Recipe data:', recipe.data());
  let objectURL: string | undefined = undefined;
  if (recipe.data().imageUrl !== 's') {
    const storage = getStorage();
    const storageRef = ref(storage, recipe_query);
    try {
      const imageBlob = await getBlob(storageRef);
      console.log('Fetching image for recipe', recipe_query);
      objectURL = URL.createObjectURL(imageBlob);
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn('Image not found in storage for recipe:', recipe_query);
        objectURL = 'https://placehold.co/1280x960'; // or set to a placeholder URL if you prefer
      } else {
        throw error; // rethrow if it's a different error
      }
    }
  }
  return {
    ...recipe.data(),
    recipeName: recipe.id,
    imageUrl: objectURL,
  } as IRecipe;
}

export async function addRecipe(recipe: IAddRecipeForm) {
  console.log('Adding recipe', recipe);
  await setDoc(doc(db, 'recipes', recipe.recipeName), {
    id: recipe.recipeName,
    name: recipe.recipeName,
    ingredients: [...recipe.ingredients],
    recipePreparation: recipe.recipePreparation,
    imageUrl: recipe.file?.size > 0 ? recipe.recipeName : '',
    updated: serverTimestamp(),
  });
  const storage = getStorage();
  const storageRef = ref(storage, recipe.recipeName);

  if (!recipe.file || !('size' in recipe.file) || recipe.file.size === 0) {
    console.error('No file provided for recipe image upload');
    return;
  }
  uploadBytes(storageRef, recipe.file).then(snapshot => {
    console.log('Uploaded a blob or file!');
  });
}

export async function updateRecipe(recipe: IUpdateRecipeForm) {
  await updateDoc(doc(db, 'recipes', recipe.recipeName), {
    id: recipe.recipeName,
    name: recipe.recipeName,
    ingredients: [...recipe.ingredients],
    recipePreparation: recipe.recipePreparation,
    imageUrl: recipe.recipeName,
    updated: serverTimestamp(),
  });
}

export async function deleteRecipe(id: string) {
  console.log('deleting recipe', id);
  await deleteDoc(doc(db, 'recipes', id));
}

export async function updateRecipeImage(
  recipe_name: string,
  file: Blob | Uint8Array | ArrayBuffer
) {
  const storage = getStorage();
  const storageRef = ref(storage, recipe_name);

  uploadBytes(storageRef, file).then(snapshot => {
    console.log('Uploaded a blob or file!');
  });
}

export async function fetchSuggestions(
  input: string,
  onlyOnList: boolean = false
): Promise<IShoppingListItem[]> {
  if (!input.trim()) {
    console.log('No input provided for suggestions');
    return [];
  }
  const base = query(
    collection(db, 'items'),
    orderBy('name'),
    startAt(input),
    endAt(`${input}\uf8ff`)
  );

  const q = onlyOnList ? query(base, where('onList', '==', false)) : base;

  const querySnapshot = await getDocs(q);
  const res = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as IShoppingListItem[];

  return res.map(item => ({
    ...item,
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1).trim(),
  }));
}
