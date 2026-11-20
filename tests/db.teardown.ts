// tests/test-node-access.ts
import { test as setup } from '@playwright/test';
import { deleteAuth, deleteDatabase } from './firebaseSetupHelpers';

setup('teardown db', async () => {
  deleteDatabase();
  deleteAuth();
});
