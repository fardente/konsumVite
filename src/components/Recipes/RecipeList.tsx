import IonIcon from '@reacticons/ionicons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchRecipes } from './Hooks/useFetchRecipes';
import RecipeListItem from './RecipeListItem';

export default function RecipeList() {
  const { data, isError, isLoading } = useFetchRecipes();

  const [searchTerm, setSearchTerm] = React.useState('');
  if (isError) return <div>Error!</div>;

  if (!data || isLoading) return <div>Loading...</div>;
  const filteredRecipes = data.filter(
    recipe =>
      recipe.recipeName.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1
  );

  return (
    <div className="container has-text-centered mb-6">
      <h2 className="title">Recipe List</h2>
      <div className="control m-4">
        <Link className="button is-success" to="/recipes/add">
          <span className="icon is-large">
            <IonIcon name="add-outline" className="is-large"></IonIcon>
          </span>
          <span>Add Recipe</span>
        </Link>
      </div>
      <div className="container searchbox mb-5">
        <div className="control has-icons-left">
          <input
            className="input"
            type="text"
            name="searchTerm"
            id="searchInput"
            placeholder="Filter list..."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          ></input>{' '}
          <span className="icon is-small is-left">
            <IonIcon name="search-outline"></IonIcon>
          </span>
        </div>
        <div className="control">
          <a
            className="button"
            onClick={() => {
              setSearchTerm('');
            }}
          >
            <span className="icon is-small is-left">
              <IonIcon name="close-outline"></IonIcon>
            </span>
          </a>
        </div>
      </div>

      <div className="columns is-multiline">
        {filteredRecipes.map(recipe => (
          <RecipeListItem key={recipe.id} {...recipe} />
        ))}
      </div>
    </div>
  );
}
