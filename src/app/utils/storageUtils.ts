import { Base64 } from "js-base64";

/**
 * Set an item from the session storage.
 * @param {string} key The key of the item to set from session storage.
 * @param {string} value The value of the item to set from session storage.
 */
export const setSessionStorageItem = (key: string, value: unknown) => {
    sessionStorage.setItem(key, Base64.encode(JSON.stringify(value)));
};

/**
 * Get an item from the session storage.
 * @param {string} key The key of the item to get  from session storage.
 */

export const getSessionStorageItem = (key: string) => {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(Base64.decode(data)) : null;
};

/**
 * Removes an item from the session storage.
 * @param {string} key The key of the item to remove from session storage.
 */
export const removeSessionStorageItem = key => {
    sessionStorage.removeItem(key);
};
