export async function deleteDatabase() {
  const response = await fetch(
    'http://localhost:8088/emulator/v1/projects/demo-spudpeek/databases/(default)/documents',
    { method: 'DELETE' }
  );
  console.log('resonse', response);
}

export async function deleteAuth() {
  const authresponse = await fetch(
    `http://localhost:9099/emulator/v1/projects/demo-spudpeek/accounts`,
    {
      method: 'DELETE',
    }
  );
  console.log('resonse', authresponse);
}

export async function createTestUser() {
  const adduserresponse = await fetch(
    `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=testkey`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@testmail.test',
        password: 'testpass',
        returnSecureToken: true,
      }),
    }
  );
  console.log('resonse', adduserresponse);
}
