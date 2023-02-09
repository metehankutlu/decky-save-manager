import { useState, useEffect } from "react";

const defaultState = {
  gameList: {},
  selectedGame: "",
  selectedProfile: "",
  selectedSavestate: ""
}

export default function useLocalStorageState(defaultValue = defaultState) {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = localStorage.getItem('state');
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
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

export { defaultState };