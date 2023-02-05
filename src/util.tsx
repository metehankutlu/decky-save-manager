import { defaultState } from "./state";

const selectGame = (game_id: string, state: any, setState: any): void => {
  setState({...state,
    selectedGame: game_id,
    selectedProfile: "",
    profileList: state.gameList ? state.gameList[game_id]["profiles"]:{},
    selectedSavestate: "",
    savestateList: {}
  });
}

const selectProfile = (profile_id: string, state: any, setState: any) => {
  setState({...state,
    selectedProfile: profile_id,
    selectedSavestate: "",
    savestateList: state.profileList ? state.profileList[profile_id]["savestates"]:{},
  });
}

const keys = (obj: any) => {
  return Object.keys(Object(obj));
}
const values = (obj: any) => {
  return Object.values(Object(obj));
}

const isEmpty = (obj: any) => {
  return keys(obj).length == 0
}

const clearState = (setState: any) => {
  return () => {
    setState(defaultState);
  }
}

export { selectGame, selectProfile, isEmpty, keys, values, clearState };