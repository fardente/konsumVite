import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchRecipes } from './Hooks/useFetchRecipes';
import RecipeListItem from './RecipeListItem';
import { IoAddOutline, IoCloseOutline, IoSearchOutline } from 'react-icons/io5';

export default function RecipeList() {
  const { data, isError, error, isLoading } = useFetchRecipes();

  const [searchTerm, setSearchTerm] = React.useState('');
  if (isError) return <div>Error! {error.message}</div>;

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
            <IoAddOutline size={32} />
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
            <IoSearchOutline />
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
              <IoCloseOutline />
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
