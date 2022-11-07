import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

export interface GlobalStateInterface {
  gameList: Object;
  selectedGame: string;
  profileList: Object;
  selectedProfile: string;
  savestateList: Object;
  selectedSavestate: string;
}

const initialState = {
    gameList: {},
    selectedGame: "",
    profileList: {},
    selectedProfile: "",
    savestateList: {},
    selectedSavestate: ""
};

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});

const GlobalStateProvider = ({
  children,
  value = initialState as GlobalStateInterface,
}: {
  children: React.ReactNode;
  value?: Partial<GlobalStateInterface>;
}) => {
  const [state, setState] = useState(value);
  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };