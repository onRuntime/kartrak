// asyncChromeLocalStorage.ts

export const setChromeLocalStorage = async <T>(key: string, value: T) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(true);
    });
  });
};

export const getChromeLocalStorage = async <T>(key: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(result[key]);
    });
  });
};
