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
import { VFC } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { UpsertModal, DeleteModal } from "../components";
import useLocalStorageState from "../state";
import { values } from "../util";
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

  let confirmCreate = (name: string) => {
    let id = uuidv4();
    let _state = JSON.parse(JSON.stringify(state));
    _state.gameList[state.selectedGame]["profiles"][id] = {
      id: id,
      name: name,
      savestates: {}
    }
    setState(_state);
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
    return function(name: string) {
      let _state = JSON.parse(JSON.stringify(state));
      _state.gameList[state.selectedGame]["profiles"][profile_id]["name"] = name;
      setState(_state);
    }
  }

  let showDeleteModal = (profile_id: string) => {
    showModal(
      <DeleteModal
        title="Delete Profile"
        description={`Are you sure you want to delete profile ${state.gameList[state.selectedGame]["profiles"][profile_id]["name"]}?`}
        id={profile_id}
        onConfirmClick={confirmDelete}
      />, window
    )
  }

  let confirmDelete = (profile_id: string) => {
    backend.resolvePromise(backend.deleteProfile(state.selectedGame, profile_id), () => {
      let _state = JSON.parse(JSON.stringify(state));
      delete _state.gameList[state.selectedGame]["profiles"][profile_id];
      if(_state.selectedProfile == profile_id) {
        _state.selectedProfile = "";
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
            rgOptions={values(state.gameList).map((value: any) => ({
              data: value["id"],
              label: value["name"]
            }))}
            selectedOption={state.selectedGame}
            onChange={(e) => setState({...state, selectedGame: e.data})} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={showCreateModal}>
          Create Profile
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        {
          state.selectedGame != "" ? 
          (
            <ul style={{ listStyleType: 'none', padding: '1rem' }}>
              {
                values(state.gameList[state.selectedGame]["profiles"]).map((profile: any) => {
                  return (
                    <li style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '10px', width: '100%', justifyContent: 'space-between' }}>
                      <span>
                        { profile["name"] }
                      </span>
                      <DialogButton
                        style={{ height: '40px', width: '40px', padding: '10px 12px', minWidth: '40px' }}
                        onClick={(e: MouseEvent) =>
                          showContextMenu(
                            <Menu label="Profile Actions">
                              <MenuItem onSelected={() => {showEditModal(profile["id"], profile["name"])}}>
                                Edit
                              </MenuItem>
                              <MenuItem onSelected={() => {showDeleteModal(profile["id"])}}>
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
    </PanelSection>
  );
};

export { ProfilesPage };