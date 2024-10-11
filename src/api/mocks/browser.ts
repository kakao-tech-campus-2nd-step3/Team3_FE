// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { friendsMockHandlers } from './friends.mock'
 
export const worker = setupWorker(...friendsMockHandlers)