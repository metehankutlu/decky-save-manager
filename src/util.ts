import { useSharedState } from './state';

const selectGame = (game_id: string): void => {
    let [state, setState] = useSharedState();
    setState({...state,
      selectedGame: game_id,
      selectedProfile: "",
      profileList: state.gameList[game_id]["profiles"],
      selectedSavestate: "",
      savestateList: {}
    });
}

const selectProfile = (profile_id: string) => {
    let [state, setState] = useSharedState();
    setState({...state,
      selectedProfile: profile_id,
      selectedSavestate: "",
      savestateList: state.profileList[profile_id]["savestates"],
    });
  }

export { selectGame, selectProfile };