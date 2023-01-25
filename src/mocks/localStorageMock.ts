import { KEY_STORAGE_MESSAGES, KEY_STORAGE_USERS } from "env-constants";

export class LocalStorageMock {
  store: { [key: string]: string } = {
    [KEY_STORAGE_USERS]: '[\'user1\']',
    [KEY_STORAGE_MESSAGES]: '[\'\']',
  };

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}
