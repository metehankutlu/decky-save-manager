import { GlobalStateInterface } from "./state";

const selectGame = (game_id: string, state: Partial<GlobalStateInterface>, setState: React.Dispatch<React.SetStateAction<Partial<GlobalStateInterface>>>): void => {
  setState({...state,
    selectedGame: game_id,
    selectedProfile: "",
    profileList: state.gameList ? state.gameList[game_id]["profiles"]:{},
    selectedSavestate: "",
    savestateList: {}
  });
}

const selectProfile = (profile_id: string, state: Partial<GlobalStateInterface>, setState: React.Dispatch<React.SetStateAction<Partial<GlobalStateInterface>>>) => {
  setState({...state,
    selectedProfile: profile_id,
    selectedSavestate: "",
    savestateList: state.profileList ? state.profileList[profile_id]["savestates"]:{},
  });
}

const keys = (obj: any) => {
  return Object.keys(Object(obj));
}

const isEmpty = (obj: any) => {
  return keys(obj).length == 0
}

export { selectGame, selectProfile, isEmpty, keys };