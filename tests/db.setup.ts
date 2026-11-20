// tests/test-node-access.ts
import { test as setup } from '@playwright/test';
import {
  deleteDatabase,
  deleteAuth,
  createTestUser,
} from './firebaseSetupHelpers';

setup('test setup', async () => {
  deleteDatabase();
  deleteAuth();
  createTestUser();
});
