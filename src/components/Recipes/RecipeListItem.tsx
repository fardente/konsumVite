import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE_URL } from '../../domain/firestoreApi';
import { Recipe } from '../../domain/recipe';

export default function RecipeListItem(recipe: Recipe) {
  const id = encodeURIComponent(recipe.name);
  const link = '/recipes/' + id;
  return (
    <div className="column is-3">
      <div className="card">
        <div className="card-image">
          <figure className="image">
            <Link to={link}>
              {' '}
              <img
                src={recipe.imageThumbnailUrl || PLACEHOLDER_IMAGE_URL}
                alt={recipe.name || 'Placeholder image'}
              />
            </Link>{' '}
          </figure>
        </div>

        <div className="card-content">
          <div className="media">
            {/* <div className="media-left"></div> */}
            <div className="media-content">
              <p className="title is-4">
                {' '}
                <Link to={link}>{recipe.name}</Link>
              </p>
              {/* <p className="subtitle is-6">@johnsmith</p> */}
            </div>
          </div>
          <div className="content">
            {recipe.recipePreparation.slice(0, 75)}...
            <br />
            {/* <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time> */}
          </div>
        </div>
      </div>
    </div>
  );
}
