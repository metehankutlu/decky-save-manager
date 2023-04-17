import { DropdownItem, ServerAPI } from "decky-frontend-lib";
import { PublicSaveManagerContext } from "../state";
import { VFC } from "react";
import { values } from "../util";
import * as backend from "../backend";

const SavestateDropdown: VFC<{
  state: PublicSaveManagerContext;
  serverAPI: ServerAPI;
}> = ({ state, serverAPI }) => {
  backend.setServer(serverAPI);
  let onMenuWillOpen = (showMenu: () => void) => {
    if (state.selectedProfile) {
      backend.resolvePromise(
        backend.getList("savestates", {
          key: "profile_id",
          value: state.selectedProfile,
        }),
        (res: object) => {
          state.setSavestates(res);
        }
      );
    }
    showMenu();
  };
  return (
    <DropdownItem
      label="Savestate"
      rgOptions={
        state.selectedGame && state.selectedProfile
          ? values(state.savestates).map((value: any) => ({
              data: value["id"],
              label: value["name"],
            }))
          : []
      }
      selectedOption={state.selectedSavestate}
      onChange={(e) => {
        state.setSelectedSavestate(e.data);
      }}
      onMenuWillOpen={onMenuWillOpen}
    />
  );
};

export { SavestateDropdown };
