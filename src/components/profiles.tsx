import { 
  DropdownItem,
  Field,
  PanelSection,
  PanelSectionRow } from "decky-frontend-lib";
import { VFC } from "react";
import { useGlobalState } from "../state";
import { isEmpty, keys, selectGame } from "../util";

const ProfilesPage: VFC = () => {
  let { state, setState } = useGlobalState();
  console.log("Profiles Page", state);
  return (
    <PanelSection>
      <PanelSectionRow>
        <DropdownItem
            label="Game"
            rgOptions={!isEmpty(state.gameList) ? keys(state.gameList).map(key => ({
              data: key,
              label: state.gameList ? state.gameList[key]["name"] : ""
            })):[]}
            selectedOption={state.selectedGame}
            onChange={(e) => selectGame(e.data, state, setState)} />
      </PanelSectionRow>
      <PanelSectionRow>
        {
          !isEmpty(state.profileList) ? keys(state.profileList).map(key => {(
            <Field>
              { state.profileList ? state.profileList[key]["name"] : "" }
            </Field>
          )}):"Select a game"
        }
      </PanelSectionRow>
    </PanelSection>
  );
};

export default ProfilesPage;