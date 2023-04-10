import { FC, createContext, useContext, useEffect, useState } from "react";

export interface PublicSaveManagerState {
  games: object;
  profiles: object;
  savestates: object;
  selectedGame: string | null;
  selectedProfile: string | null;
  selectedSavestate: string | null;
}

export interface PublicSaveManagerContext extends PublicSaveManagerState {
  upsertGame(game: object): void;
  upsertProfile(profile: object): void;
  upsertSavestate(savestate: object): void;
  deleteGame(game_id: string): void;
  deleteProfile(profile_id: string): void;
  deleteSavestate(savestate_id: string): void;
  setGames(games: object): void;
  setProfiles(profiles: object): void;
  setSavestates(savestates: object): void;
  setSelectedGame(game_id: string): void;
  setSelectedProfile(profile_id: string): void;
  setSelectedSavestate(savestate_id: string): void;
}

export class SaveManagerState {
  private games: object = {};
  private profiles: object = {};
  private savestates: object = {};
  private selectedGame: string | null = null;
  private selectedProfile: string | null = null;
  private selectedSavestate: string | null = null;

  public eventBus = new EventTarget();

  getPublicState() {
    return {
      games: this.games,
      profiles: this.profiles,
      savestates: this.savestates,
      selectedGame: this.selectedGame,
      selectedProfile: this.selectedProfile,
      selectedSavestate: this.selectedSavestate,
    };
  }

  upsertGame(game: object): void {
    this.games[game["id"]] = game;
    this.forceUpdate();
  }

  upsertProfile(profile: object): void {
    this.profiles[profile["id"]] = profile;
    this.forceUpdate();
  }

  upsertSavestate(savestate: object): void {
    this.savestates[savestate["id"]] = savestate;
    this.forceUpdate();
  }

  deleteGame(game_id: string): void {
    delete this.games[game_id];
    this.forceUpdate();
  }

  deleteProfile(profile_id: string): void {
    delete this.profiles[profile_id];
    this.forceUpdate();
  }

  deleteSavestate(savestate_id: string): void {
    delete this.savestates[savestate_id];
    this.forceUpdate();
  }

  setGames(games: object): void {
    this.games = games;
    this.forceUpdate();
  }

  setProfiles(profiles: object): void {
    this.profiles = profiles;
    this.forceUpdate();
  }

  setSavestates(savestates: object): void {
    this.savestates = savestates;
    this.forceUpdate();
  }

  setSelectedGame(selectedGame: string | null): void {
    if (selectedGame != this.selectedGame) {
      this.selectedProfile = null;
      this.selectedSavestate = null;
    }
    this.selectedGame = selectedGame;
    this.forceUpdate();
  }

  setSelectedProfile(selectedProfile: string | null): void {
    if (selectedProfile != this.selectedProfile) {
      this.selectedSavestate = null;
    }
    this.selectedProfile = selectedProfile;
    this.forceUpdate();
  }

  setSelectedSavestate(selectedSavestate: string | null): void {
    this.selectedSavestate = selectedSavestate;
    this.forceUpdate();
  }

  private forceUpdate(): void {
    this.eventBus.dispatchEvent(new Event("stateUpdate"));
  }
}

const SaveManagerContext = createContext<PublicSaveManagerContext>(null as any);
export const useSaveManagerState = () => useContext(SaveManagerContext);

interface ProviderProps {
  saveManagerStateClass: SaveManagerState;
}

export const SaveManagerContextProvider: FC<ProviderProps> = ({
  children,
  saveManagerStateClass,
}) => {
  const [publicState, setPublicState] = useState<PublicSaveManagerState>({
    ...saveManagerStateClass.getPublicState(),
  });

  useEffect(() => {
    function onUpdate() {
      setPublicState({ ...saveManagerStateClass.getPublicState() });
    }

    saveManagerStateClass.eventBus.addEventListener("stateUpdate", onUpdate);

    return () => {
      saveManagerStateClass.eventBus.removeEventListener(
        "stateUpdate",
        onUpdate
      );
    };
  }, []);

  const upsertGame = (game: object) => {
    saveManagerStateClass.upsertGame(game);
  };

  const upsertProfile = (profile: object) => {
    saveManagerStateClass.upsertProfile(profile);
  };

  const upsertSavestate = (savestate: object) => {
    saveManagerStateClass.upsertSavestate(savestate);
  };

  const deleteGame = (game_id: string) => {
    saveManagerStateClass.deleteGame(game_id);
  };

  const deleteProfile = (profile_id: string) => {
    saveManagerStateClass.deleteProfile(profile_id);
  };

  const deleteSavestate = (savestate_id: string) => {
    saveManagerStateClass.deleteSavestate(savestate_id);
  };

  const setGames = (games: object) => {
    saveManagerStateClass.setGames(games);
  }

  const setProfiles = (profiles: object) => {
    saveManagerStateClass.setProfiles(profiles);
  }

  const setSavestates = (savestates: object) => {
    saveManagerStateClass.setSavestates(savestates);
  }

  const setSelectedGame = (selectedGame: string | null) => {
    saveManagerStateClass.setSelectedGame(selectedGame);
  };

  const setSelectedProfile = (selectedProfile: string | null) => {
    saveManagerStateClass.setSelectedProfile(selectedProfile);
  };

  const setSelectedSavestate = (selectedSavestate: string | null) => {
    saveManagerStateClass.setSelectedSavestate(selectedSavestate);
  };

  return (
    <SaveManagerContext.Provider
      value={{
        ...publicState,
        upsertGame,
        upsertProfile,
        upsertSavestate,
        deleteGame,
        deleteProfile,
        deleteSavestate,
        setGames,
        setProfiles,
        setSavestates,
        setSelectedGame,
        setSelectedProfile,
        setSelectedSavestate,
      }}
    >
      {children}
    </SaveManagerContext.Provider>
  );
};
