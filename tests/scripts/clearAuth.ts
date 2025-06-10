import { deleteAuth } from '../firebaseSetupHelpers.ts';

(async () => {
  try {
    console.log('Deleting user accounts...');
    await deleteAuth();
    console.log('User accounts deleted successfully!');
  } catch (error) {
    console.error('Error deleting user accounts', error);
    process.exit(1); // Exit with an error code if something goes wrong
  }
})();
