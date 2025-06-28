import React, { Dispatch, SetStateAction } from 'react';

export default function LoginForm({
  handleLogin,
  setError,
}: {
  handleLogin: (username: string, password: string) => Promise<void>;
  setError: Dispatch<SetStateAction<Error | undefined>>;
}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div className="container has-text-centered m-5">
      <h1 className="title is-3">Login</h1>
      <form
        onSubmit={event => {
          event.preventDefault();
          handleLogin(username, password);
        }}
        autoComplete="off"
      >
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              name="username"
              value={username}
              onChange={event => {
                setUsername(event.target.value);
                setError(undefined);
              }}
              placeholder="User Name"
              required
            ></input>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="password"
              name="password"
              value={password}
              onChange={event => {
                setPassword(event.target.value);
                setError(undefined);
              }}
              placeholder="Password"
              required
            ></input>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button
              className="button is-success is-light is-outlined mt-3"
              name="addIngredientBtn"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
