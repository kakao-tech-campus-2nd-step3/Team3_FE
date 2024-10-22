// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import friendsMockHandlers from "./friends.mock";
import loginMockHandler from "./login.mock";

const worker = setupWorker(
  ...friendsMockHandlers,
  ...loginMockHandler,
);

export default worker;
