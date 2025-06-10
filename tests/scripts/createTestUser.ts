import { createTestUser } from '../firebaseSetupHelpers.ts';

(async () => {
  try {
    console.log('Creating test user...');
    await createTestUser();
    console.log('Test user created successfully!');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1); // Exit with an error code if something goes wrong
  }
})();
