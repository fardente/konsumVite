import {
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
} from 'firebase/firestore';

export class Recipe {
  name: string;
  recipePreparation: string;
  ingredients: string[];
  imageUrl: string;
  imageThumbnailUrl: string;

  constructor(
    name: string,
    recipePreparation: string = '',
    ingredients: string[] = [],
    imageUrl: string = '',
    imageThumbnailUrl: string = ''
  ) {
    this.name = name.trim();
    this.recipePreparation = recipePreparation.trim();
    this.ingredients = ingredients.map(ingredient => ingredient.trim());
    this.imageUrl = imageUrl;
    this.imageThumbnailUrl = imageThumbnailUrl;
  }

  toString() {
    return this.name;
  }
}

export const RecipeConverter = {
  toFirestore: (recipe: Recipe) => {
    return {
      name: recipe.name,
      recipePreparation: recipe.recipePreparation,
      ingredients: recipe.ingredients,
      imageUrl: recipe.imageUrl,
      imageThumbnailUrl: recipe.imageThumbnailUrl,
      updated: serverTimestamp(),
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return new Recipe(
      data.name,
      data.recipePreparation,
      data.ingredients,
      data.imageUrl,
      data.imageThumbnailUrl
    );
  },
};
