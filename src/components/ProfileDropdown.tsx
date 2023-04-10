import { DropdownItem } from "decky-frontend-lib";
import { PublicSaveManagerContext } from "../state";
import { VFC } from "react";
import { values } from "../util";

const ProfileDropdown: VFC<{ state: PublicSaveManagerContext }> = ({
  state,
}) => {
  // let onMenuWillOpen = (showMenu: () => void) => {
  //   setState(getCurrentState());
  //   showMenu();
  // }
  return (
    <DropdownItem
      label="Profile"
      rgOptions={
        state.selectedGame
          ? values(state.profiles).map((value: any) => ({
              data: value["id"],
              label: value["name"],
            }))
          : []
      }
      selectedOption={state.selectedProfile}
      onChange={(e) => {
        state.setSelectedProfile(e.data);
      }}
      // onMenuWillOpen={onMenuWillOpen}
    />
  );
};

export { ProfileDropdown };
