import { useState, useEffect } from "react";

const defaultState = {
  gameList: {},
  selectedGame: "",
  selectedProfile: "",
  selectedSavestate: ""
}

const stateKey = 'decky-save-manager-storage';

export default function useLocalStorageState(defaultValue = defaultState) {
  const [state, setState] = useState(() => {
    return getCurrentState() ?? defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

let getCurrentState = () => {
  const valueInLocalStorage = localStorage.getItem(stateKey);
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
}

export { defaultState, getCurrentState };