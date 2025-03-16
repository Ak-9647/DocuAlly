/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as client from "../client.js";
import type * as documents from "../documents.js";
import type * as emailLogs from "../emailLogs.js";
import type * as files from "../files.js";
import type * as scheduledTasks from "../scheduledTasks.js";
import type * as signatureFields from "../signatureFields.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  client: typeof client;
  documents: typeof documents;
  emailLogs: typeof emailLogs;
  files: typeof files;
  scheduledTasks: typeof scheduledTasks;
  signatureFields: typeof signatureFields;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
