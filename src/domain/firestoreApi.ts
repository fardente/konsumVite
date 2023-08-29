import {
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase';
import { IShoppingListItem } from './api';

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
  const items = await getDocs(
    query(collection(db, 'items'), orderBy('updated', 'desc'))
  );
  return items.docs.map(doc => {
    return { ...doc.data(), name: doc.id } as IShoppingListItem;
  });
}

export async function addShoppingItem(name: string) {
  name = name.toLowerCase().trim();
  await setDoc(
    doc(db, 'items', name),
    {
      id: name,
      onList: true,
      checked: false,
      name,
      tags: [],
      updated: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function checkShoppingItem(id: string, checked: boolean) {
  await updateDoc(doc(db, 'items', id), { checked });
}

export async function deleteShoppingItem(id: string) {
  await deleteDoc(doc(db, 'items', id));
}

export async function addTagToShoppingItem(id: string, tag: string) {
  tag = tag.toLowerCase().trim();
  await updateDoc(doc(db, 'items', id), { tags: arrayUnion(tag) });
}

export async function removeTagFromShoppingItem(itemId: string, tag: string) {
  await updateDoc(doc(db, 'items', itemId), { tags: arrayRemove(tag) });
}
