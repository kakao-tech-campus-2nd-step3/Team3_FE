// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import friendsMockHandlers from "./friends.mock";

const worker = setupWorker(...friendsMockHandlers);

export default worker;
