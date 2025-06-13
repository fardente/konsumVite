import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoPizzaSharp } from 'react-icons/io5';

export default function Nav() {
  const [active, setActive] = React.useState('');
  const location = useLocation();

  function onToggleActive() {
    return setActive(active => (active ? '' : 'is-active'));
  }

  function getTitle(pathname: string) {
    if (pathname.startsWith('/recipes')) return 'Recipes';
    if (pathname.startsWith('/ingredients')) return 'Ingredients';
    return 'Shopping List';
  }

  return (
    <div className="navbar has-shadow">
      <div className="navbar-brand">
        <div className="navbar-item">
          <span className="icon mx-3 has-background-warning-light has-text-danger-dark">
            <IoPizzaSharp className="is-large" />
          </span>
          {getTitle(location.pathname)}
        </div>

        <div
          className={`navbar-burger ${active}`}
          onClick={() => onToggleActive()}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className={`navbar-menu ${active}`} id="nav-links">
        <div className="navbar-end">
          <Link
            onClick={() => onToggleActive()}
            className="navbar-item has-text-centered"
            to="/"
          >
            Shopping List
          </Link>
          <Link
            onClick={() => onToggleActive()}
            className="navbar-item has-text-centered"
            to="/recipes"
          >
            Recipes
          </Link>
          <Link
            onClick={() => onToggleActive()}
            className="navbar-item has-text-centered"
            to="/ingredients"
          >
            Ingredients
          </Link>
        </div>
      </div>
    </div>
  );
}
