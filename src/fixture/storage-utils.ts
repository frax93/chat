export const storageUtils = {
  setLocal(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  getLocal(key: string) {
    return JSON.parse(window.localStorage.getItem(key) as string);
  },
  removeLocal(key: string) {
    window.localStorage.removeItem(key);
  },
  setSession(key: string, value: any) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSession(key: string) {
    return JSON.parse(window.sessionStorage.getItem(key) as string);
  },
  removeSession(key: string) {
    window.sessionStorage.removeItem(key);
  },
};
