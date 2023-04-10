import { DropdownItem } from "decky-frontend-lib";
import { PublicSaveManagerContext } from "../state";
import { VFC } from "react";
import { values } from "../util";

const SavestateDropdown: VFC<{ state: PublicSaveManagerContext }> = ({
  state,
}) => {
  // let onMenuWillOpen = (showMenu: () => void) => {
  //   setState(getCurrentState());
  //   showMenu();
  // }
  return (
    <DropdownItem
      label="Savestate"
      rgOptions={
        state.selectedGame && state.selectedProfile
          ? values(state.profiles).map((value: any) => ({
              data: value["id"],
              label: value["name"],
            }))
          : []
      }
      selectedOption={state.selectedSavestate}
      onChange={(e) => {
        state.setSelectedSavestate(e.data);
      }}
      // onMenuWillOpen={onMenuWillOpen}
    />
  );
};

export { SavestateDropdown };
