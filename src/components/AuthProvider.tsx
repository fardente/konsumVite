import React, { SetStateAction } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import LoginForm from './LoginForm';
import { auth } from '../firebase';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<User | null>(auth.currentUser);
  const [userChecked, setUserChecked] = React.useState(false);
  const [error, setError] = React.useState<Error>();

  async function handleLogin(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      console.error(e);
      setError(e as SetStateAction<Error | undefined>);
    }
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setUserChecked(true);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <div>{error && <span style={{ color: 'red' }}>Login error!</span>}</div>
      {userChecked ? (
        user ? (
          children
        ) : (
          <LoginForm handleLogin={handleLogin} setError={setError} />
        )
      ) : (
        'Loading...'
      )}
    </div>
  );
}
