export const persistState = (storageKey: string, state: any) => {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

export const getPersistedState: any = (storageKey: string) => {
  const savedState = window.localStorage.getItem(storageKey);
  try {
    if (!savedState) {
      return undefined;
    }
    return JSON.parse(savedState);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const persistStateSession = (storageKey: string, state: any) => {
  window.sessionStorage.setItem(storageKey, JSON.stringify(state));
};

export const getPersistedStateSession: any = (storageKey: string) => {
  const savedState = window.sessionStorage.getItem(storageKey);
  try {
    if (!savedState) {
      return undefined;
    }
    return JSON.parse(savedState);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
