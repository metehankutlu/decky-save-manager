import { DropdownItem, ServerAPI } from "decky-frontend-lib";
import { PublicSaveManagerContext } from "../state";
import { VFC } from "react";
import { values } from "../util";
import * as backend from "../backend";

const GameDropdown: VFC<{
  state: PublicSaveManagerContext;
  serverAPI: ServerAPI;
}> = ({ state, serverAPI }) => {
  backend.setServer(serverAPI);
  let onMenuWillOpen = (showMenu: () => void) => {
    if (values(state.games).length == 0) {
      backend.resolvePromise(backend.getList("games"), (res: object) => {
        state.setGames(res);
      });
    }
    showMenu();
  };
  return (
    <DropdownItem
      label="Game"
      rgOptions={values(state.games).map((value: any) => ({
        data: value["id"],
        label: value["name"],
      }))}
      selectedOption={state.selectedGame}
      onChange={(e) => {
        state.setSelectedGame(e.data);
      }}
      onMenuWillOpen={onMenuWillOpen}
    />
  );
};

export { GameDropdown };
