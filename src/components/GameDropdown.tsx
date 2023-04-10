import { DropdownItem } from "decky-frontend-lib";
import { PublicSaveManagerContext } from "../state";
import { VFC } from "react";
import { values } from "../util";

const GameDropdown: VFC<{ state: PublicSaveManagerContext }> = ({ state }) => {
  // let onMenuWillOpen = (showMenu: () => void) => {
  //   setState(getCurrentState());
  //   showMenu();
  // }
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
      // onMenuWillOpen={onMenuWillOpen}
    />
  );
};

export { GameDropdown };
