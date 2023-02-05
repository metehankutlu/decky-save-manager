import { 
  ButtonItem,
  DialogButton,
  DropdownItem,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  showModal
} from "decky-frontend-lib";
import { UpsertModal, DeleteModal } from "../components";
import { VFC } from "react";
import { FaEllipsisH } from "react-icons/fa";
import useLocalStorageState from "../state";
import { isEmpty, keys, selectGame, values } from "../util";
import * as backend from "../backend";

const ProfilesPage: VFC<{ serverAPI: ServerAPI}> = ({serverAPI}) => {
  backend.setServer(serverAPI);
  let [state, setState] = useLocalStorageState();

  let showCreateModal = () => {
    showModal(
      <UpsertModal
        title="Create Profile"
        onConfirmClick={confirmCreate}
      />, window
    );
  }

  let confirmCreate = (text: string) => {
    backend.resolvePromise(backend.createProfile(state.selectedGame, text), (result: any) => {
      let _state = JSON.parse(JSON.stringify(state));
      _state.profileList[result.id] = result
      _state.gameList[state.selectedGame]["profiles"][result.id] = result
      setState(_state);
    });
  }

  let showEditModal = (profile_id: string, name: string) => {
    showModal(
      <UpsertModal
        title="Edit Profile"
        onConfirmClick={confirmEdit(profile_id)}
        textDefault={name}
      />, window
    );
  }

  let confirmEdit = (profile_id: string) => {
    return function(text: string) {
      backend.resolvePromise(backend.renameProfile(state.selectedGame, profile_id, text), () => {
        let _state = JSON.parse(JSON.stringify(state));
        _state.profileList[profile_id]["name"] = text;
        _state.gameList[state.selectedGame]["profiles"][profile_id]["name"] = text;
        setState(_state);
      });
    }
  }

  let showDeleteModal = (profile_id: string) => {
    showModal(
      <DeleteModal
        title="Delete Profile"
        description={`Are you sure you want to delete profile ${state.profileList[profile_id]["name"]}?`}
        id={profile_id}
        onConfirmClick={confirmDelete}
      />, window
    )
  }

  let confirmDelete = (profile_id: string) => {
    backend.resolvePromise(backend.deleteProfile(state.selectedGame, profile_id), () => {
      let _state = JSON.parse(JSON.stringify(state));
      delete _state.profileList[profile_id];
      delete _state.gameList[state.selectedGame]["profiles"][profile_id];
      if(_state.selectedProfile == profile_id) {
        _state.selectedProfile = "";
        _state.savestateList = {};
        _state.selectedSavestate = "";
      }
      setState(_state);
    });
  }
  
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
        <ButtonItem onClick={showCreateModal}>
          Create Profile
        </ButtonItem>
      </PanelSectionRow>
      {
        <PanelSectionRow>
          {
            !isEmpty(state.profileList) ? 
            (
              <ul style={{ listStyleType: 'none', padding: '1rem' }}>
                {
                  values(state.profileList).map((val: any) => {
                    return (
                      <li style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '10px', width: '100%', justifyContent: 'space-between' }}>
                        <span>
                          { val["name"] }
                        </span>
                        <DialogButton
                          style={{ height: '40px', width: '40px', padding: '10px 12px', minWidth: '40px' }}
                          onClick={(e: MouseEvent) =>
                            showContextMenu(
                              <Menu label="Profile Actions">
                                <MenuItem onSelected={() => {showEditModal(val["id"], val["name"])}}>
                                  Edit
                                </MenuItem>
                                <MenuItem onSelected={() => {showDeleteModal(val["id"])}}>
                                  Delete
                                </MenuItem>
                              </Menu>,
                              e.currentTarget ?? window,
                            )
                          }
                        >
                          <FaEllipsisH />
                        </DialogButton>
                      </li>
                    )
                  })
                }
              </ul>
            )
            : "Select a game"
          }
        </PanelSectionRow>
      }
    </PanelSection>
  );
};

export { ProfilesPage };