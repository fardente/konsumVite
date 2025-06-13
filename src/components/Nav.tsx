import React from 'react';
import { Link } from 'react-router-dom';
import { IoPizzaSharp } from 'react-icons/io5';

export default function Nav() {
  const [active, setActive] = React.useState('');

  function onToggleActive() {
    return setActive(active => (active ? '' : 'is-active'));
  }

  return (
    <div className="navbar has-shadow">
      <div className="navbar-brand">
        <div className="navbar-item">
          <span className="icon mx-3 has-background-warning-light has-text-danger-dark">
            <IoPizzaSharp className="is-large" />
          </span>
          {'   '}Recipe Manager
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
