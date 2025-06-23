import React from 'react';
import {
  IoCameraOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../../domain/recipe';
import { useDeleteRecipeMutation } from './Hooks/deleteRecipeMutation';
import { useUpdateRecipeImageMutation } from './Hooks/updateRecipeImageMutation';
import { useUpdateRecipeMutation } from './Hooks/updateRecipeMutation';
import { useFetchRecipe } from './Hooks/useFetchRecipe';
import IngredientsList from './IngredientsList';

export default function RecipeDetails() {
  const { id } = useParams();
  if (!id) return <div></div>;

  const { isError, error, isLoading, data: recipe } = useFetchRecipe(id);
  const { mutate: submitUpdateRecipe } = useUpdateRecipeMutation();
  const { mutate: deleteRecipe } = useDeleteRecipeMutation();
  const { mutate: updateRecipeImage } = useUpdateRecipeImageMutation();
  const [editMode, setEditMode] = React.useState(false);
  const navigate = useNavigate();

  if (isError) return <div>Could not load recipe: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!recipe) return <div>Loading...</div>;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const recipeDto: Recipe = {
      name: formData.get('recipe_name') as string,
      recipePreparation: formData.get('recipe_preparation') as string,
      imageUrl: formData.get('recipe_name') as string,
      ingredients: formData.getAll('ingredient') as string[],
    };
    submitUpdateRecipe(recipeDto);
    setEditMode(false);
  }

  function changeImage(
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) {
    event.preventDefault();
    if (!event.target.files) {
      console.log('no files');
      return event.target;
    }
    if (event.target.files[0].size > 1024 * 1024 * 10) {
      console.log('file too big');
      return event.target;
    }
    if (event.target.files[0].type !== 'image/jpeg') {
      console.log('file not jpeg');
      return event.target;
    }
    console.log('submitting image', event.target.files[0]);
    updateRecipeImage({
      recipe_name: name,
      file: event.target.files[0],
    });
    return event.target;
  }

  function onDeleteRecipe(name: string) {
    deleteRecipe(name);
    navigate('/recipes');
  }

  const editTitleInput = (
    <input
      className="input is-info"
      type="text"
      name="recipe_name"
      defaultValue={recipe.name}
    ></input>
  );

  function title(recipe: Recipe) {
    if (editMode) {
      return editTitleInput;
    }
    return recipe.name;
  }

  const renderform = (
    <>
      <section
        className="hero is-medium is-info is-relative"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(' +
            recipe.imageUrl +
            ')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          paddingBottom: '20px',
        }}
      >
        <div className="hero-body">
          <p className="title">{title(recipe)}</p>
          <div className="field is-grouped is-grouped-right edit-recipe-div">
            {/* Image file button */}
            <div className="recipe-file-button">
              <div className="file">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    name="newRecipeImage"
                    onChange={event => changeImage(event, recipe.name)}
                  />
                  <span className="icon is-large">
                    <IoCameraOutline />
                  </span>
                </label>
              </div>
            </div>

            {/* Delete Button */}
            {editMode && (
              <button
                className="recipe-button"
                onClick={() => onDeleteRecipe(recipe.name)}
              >
                <span className="icon is-large">
                  <IoTrashOutline />
                </span>
              </button>
            )}
            {/* Edit Mode Actions */}

            {/* Save Changes Button */}
            {editMode && (
              <button type="submit" className="recipe-button">
                <span className="icon is-large">
                  <IoCheckmarkCircleOutline />
                </span>
              </button>
            )}

            {/* Edit Mode Toggle Button */}
            <button
              className="recipe-button"
              onClick={() => setEditMode(prev => !prev)}
            >
              {editMode ? (
                /* Cancel Button */
                <span className="icon is-large">
                  <IoCloseCircleOutline />
                </span>
              ) : (
                /* Edit Button */
                <span className="icon is-large">
                  <IoCreateOutline />
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="container mt-5">
        {/* <img src={recipe.image_url} onClick={onImageClick}></img> */}
        <div className="columns">
          <div className="column is-one-third">
            <IngredientsList
              ingredients={recipe.ingredients}
              recipeName={recipe.name}
              editMode={editMode}
            />
          </div>
          <div className="column is-two-thirds">
            {editMode ? (
              <textarea
                className="textarea is-info"
                rows={15}
                name="recipe_preparation"
                defaultValue={recipe.recipePreparation}
              ></textarea>
            ) : (
              <div className="box">
                <div className="content preparation has-text-left">
                  {recipe.recipePreparation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container has-text-centered">
      {editMode ? (
        <form
          action="/"
          method="POST"
          encType=""
          onSubmit={event => onSubmit(event)}
        >
          {renderform}
        </form>
      ) : (
        renderform
      )}
    </div>
  );
}
