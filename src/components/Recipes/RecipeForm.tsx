import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { IAddRecipeForm } from '../../domain/interfaces';
import useAddRecipeMutation from './Hooks/useAddRecipeMutation';
import IngredientsForm from './IngredientsForm';

export default function RecipeForm() {
  const navigate = useNavigate();
  const { mutate: addRecipe } = useAddRecipeMutation();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const name = formData.get('recipe_name') as string;
    const recipePreparation = formData.get('recipe_preparation') as string;
    const file = formData.get('file') as File;
    const ingredients: string[] = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('ingredient'))
      .map(([, value]) => value.toString().trim());
    const newrec: IAddRecipeForm = {
      name,
      recipePreparation,
      ingredients,
      file,
    };
    addRecipe(newrec);
    navigate('/recipes');
  }

  return (
    <div className="container has-text-centered mb-6">
      <h2 className="title">Add a Recipe</h2>
      <div className="columns is-centered">
        <div className="column  is-half">
          <form
            action="/"
            method="POST"
            encType="multipart/form-data"
            onSubmit={event => onSubmit(event)}
          >
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="recipe_name"
                  placeholder="Recipe Name"
                  required
                ></input>
              </div>
            </div>
            {/* <IngredientsForm
              ingredients={ingredients}
              setIngredients={setIngredients}
              editMode={edit}
            /> */}
            {/* Ingredients */}
            <div className="box">
              <h2 className="subtitle has-text-weight-semibold has-text-centered">
                Ingredients:
              </h2>
              <IngredientsForm ingredient_names={['']} />
            </div>

            <div className="field">
              <div className="control">
                <textarea
                  className="textarea is-info"
                  name="recipe_preparation"
                  placeholder="Add preparation steps here..."
                ></textarea>
              </div>
            </div>

            <div className="field has-text-left">
              <label className="label">Add an image:</label>
              <div className="file is-info is-small">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    name="file"
                    id="file"
                    // onChange={onFileSelect}
                  ></input>
                  <span className="file-cta">
                    <span className="file-icon">
                      <IoCloseOutline />
                    </span>
                    <span className="file-label">Choose a file…</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button
                  className="button is-success"
                  // className={`button is-success ${loading ? 'is-loading' : ''}`}
                  type="submit"
                >
                  Save
                </button>
              </div>
              <div className="control">
                <Link className="button" to="/recipes">
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <StatusMessage message={errorMessage} /> */}
    </div>
  );
}
