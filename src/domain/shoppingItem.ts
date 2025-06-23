import {
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
} from 'firebase/firestore';

export class ShoppingItem {
  name: string;
  name_lowercase: string;
  _tags: Set<string>;
  onList: boolean;
  checked: boolean;

  constructor(
    name: string,
    tags: string[] = [],
    onList: boolean = true,
    checked: boolean = false
  ) {
    this.name = name.trim();
    this.name_lowercase = name.toLowerCase();
    this._tags = new Set(tags.map(tag => tag.toLowerCase().trim()));
    this.onList = onList;
    this.checked = checked;
  }

  toString() {
    return this.name;
  }

  public getTags(): string[] {
    return Array.from(this._tags);
  }

  public addTag(tag: string): void {
    this._tags.add(tag.toLowerCase().trim());
  }

  public removeTag(tag: string): void {
    this._tags.delete(tag.toLowerCase().trim());
  }

  public get tags(): string[] {
    return this.getTags();
  }
}

export const ShoppingItemConverter = {
  toFirestore: (item: ShoppingItem) => {
    return {
      name: item.name,
      name_lowercase: item.name_lowercase,
      tags: item.getTags(),
      onList: item.onList,
      checked: item.checked,
      updated: serverTimestamp(),
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return new ShoppingItem(data.name, data.tags, data.onList, data.checked);
  },
};
