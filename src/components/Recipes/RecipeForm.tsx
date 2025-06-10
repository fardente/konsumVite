import IonIcon from '@reacticons/ionicons';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAddRecipeMutation from './Hooks/useAddRecipeMutation';

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState([{ ingredientName: '' }]);

  const navigate = useNavigate();
  const mutate = useAddRecipeMutation();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const ingredients: string[] = [];
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const r: any = {};
    r.recipeName = formData.get('recipe_name') as string;
    r.recipePreparation = formData.get('recipe_preparation') as string;
    r.file = formData.get('file') as File;
    console.log(
      'map',
      [...formData.entries()].map(e => {
        if (typeof e[1] === 'string' && e[0].startsWith('ingredient')) {
          ingredients.push(e[1]);
          return;
        }
        r[e[0]] = e[1];
      })
    );
    r.ingredients = ingredients;
    mutate.mutate(r);
    navigate('/recipes');
  }

  function onAdd(event: React.FormEvent) {
    event.preventDefault();
    setIngredients([...ingredients, { ingredientName: '' }]);
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
              <div className="field">
                {ingredients.map((item, index) => (
                  <div className="field has-addons" key={index.toString()}>
                    <div className="control">
                      <input
                        className="input"
                        name={'ingredient' + index}
                        type="text"
                        placeholder="New ingredient..."
                        autoComplete="off"
                        data-testid={'ingredientInput' + index}
                      ></input>
                      {/* {showResults && renderResults(index)} */}
                    </div>
                    <div className="control">
                      <a
                        // name={index}
                        // onClick={event => onRemove(event, index)}
                        className="button is-danger is-light"
                      >
                        {' '}
                        <span className="icon is-small is-left">
                          <IonIcon name="close-outline"></IonIcon>
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
                <div className="control">
                  <button
                    className="button is-success is-light is-outlined"
                    name="addIngredientBtn"
                    onClick={event => onAdd(event)}
                  >
                    Add
                  </button>
                </div>
              </div>
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
                      <IonIcon name="cloud-upload-outline"></IonIcon>
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
