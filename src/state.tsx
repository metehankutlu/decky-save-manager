import { useState, useEffect } from "react";

const defaultState = {
  gameList: {},
  selectedGame: "",
  profileList: {},
  selectedProfile: "",
  savestateList: {},
  selectedSavestate: ""
}

export default function useLocalStorageState(key: string, defaultValue = defaultState) {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = localStorage.getItem(key);
    if (valueInLocalStorage) {
      try
      {
        let value = JSON.parse(valueInLocalStorage);
        return value;
      }
      catch(ex)
      {
        return null;
      }
    }

    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
