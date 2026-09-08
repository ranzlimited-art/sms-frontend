/**
 * syncQueue.ts
 * ---------------------------------------------------------------------------
 * Queues write requests (POST/PUT/PATCH/DELETE) made while offline, and
 * replays them in order once the browser comes back online.
 *
 * Not used by the login flow itself — you can't authenticate offline — but
 * this is the piece the rest of the app (marking attendance, recording a
 * payment, etc. while offline) will lean on, and the folder structure
 * already reserves a spot for it.
 *
 * Usage:
 *   import { enqueue, initSyncQueue } from '../sync/syncQueue';
 *   import { apiClient } from '../api/client';
 *
 *   // when a write fails because the device is offline:
 *   await enqueue({ method: 'POST', path: '/attendance', body: payload });
 *
 *   // once, at app startup:
 *   initSyncQueue(async (action) => {
 *     await apiClient[action.method.toLowerCase() as 'post'](action.path, action.body);
 *   });
 * ---------------------------------------------------------------------------
 */

import { dbDelete, dbGetAll, dbSet } from '../db/db';

const STORE = 'sync_queue' as const;
const MAX_RETRIES = 5;

export interface QueuedAction {
  id: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  created_at: number;
  retries: number;
}

type ActionInput = Pick<QueuedAction, 'method' | 'path' | 'body'>;
type Sender = (action: QueuedAction) => Promise<void>;

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Adds an action to the offline queue. Call this from a catch block when a write fails because there's no connection. */
export async function enqueue(action: ActionInput): Promise<QueuedAction> {
  const entry: QueuedAction = {
    ...action,
    id: makeId(),
    created_at: Date.now(),
    retries: 0,
  };
  await dbSet(STORE, entry.id, entry);
  return entry;
}

/** Returns every queued action, oldest first (the order they should be replayed in). */
export async function getQueue(): Promise<QueuedAction[]> {
  const rows = await dbGetAll<QueuedAction>(STORE);
  return rows.map((r) => r.value).sort((a, b) => a.created_at - b.created_at);
}

export async function removeFromQueue(id: string): Promise<void> {
  await dbDelete(STORE, id);
}

/**
 * Replays the queue in order using `sender`. Stops at the first action that
 * still fails (to preserve ordering — e.g. don't create a payment before
 * the invoice it belongs to), and drops an action after MAX_RETRIES so one
 * bad request can't block the queue forever.
 */
export async function processQueue(sender: Sender): Promise<void> {
  if (!navigator.onLine) return;

  const queue = await getQueue();

  for (const action of queue) {
    try {
      await sender(action);
      await removeFromQueue(action.id);
    } catch {
      const retries = action.retries + 1;
      if (retries >= MAX_RETRIES) {
        await removeFromQueue(action.id);
      } else {
        await dbSet(STORE, action.id, { ...action, retries });
      }
      break;
    }
  }
}

let listenerAttached = false;

/** Call once at app startup. Automatically drains the queue whenever the browser regains a connection. */
export function initSyncQueue(sender: Sender): void {
  if (listenerAttached) return;
  listenerAttached = true;

  window.addEventListener('online', () => {
    processQueue(sender);
  });

  if (navigator.onLine) {
    processQueue(sender);
  }
}