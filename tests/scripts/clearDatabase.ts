import { deleteDatabase } from '../firebaseSetupHelpers.ts';

(async () => {
  try {
    console.log('Deleting database...');
    await deleteDatabase();
    console.log('Database deleted successfully!');
  } catch (error) {
    console.error('Error deleting database', error);
    process.exit(1); // Exit with an error code if something goes wrong
  }
})();
