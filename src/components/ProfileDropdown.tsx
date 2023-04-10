import { DropdownItem, ServerAPI } from "decky-frontend-lib";
import { PublicSaveManagerContext } from "../state";
import { VFC } from "react";
import { values } from "../util";
import * as backend from "../backend";

const ProfileDropdown: VFC<{
  state: PublicSaveManagerContext;
  serverAPI: ServerAPI;
}> = ({ state, serverAPI }) => {
  backend.setServer(serverAPI);
  let onMenuWillOpen = (showMenu: () => void) => {
    if (values(state.profiles).length == 0 && state.selectedGame) {
      backend.resolvePromise(
        backend.getList("profiles", {
          key: "game_id",
          value: state.selectedGame,
        }),
        (res: object) => {
          state.setProfiles(res);
        }
      );
    }
    showMenu();
  };
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
      onMenuWillOpen={onMenuWillOpen}
    />
  );
};

export { ProfileDropdown };
