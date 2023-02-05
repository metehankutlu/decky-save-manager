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
import { isEmpty, keys, selectGame, selectProfile, values } from "../util";
import * as backend from "../backend";

const SavestatesPage: VFC<{ serverAPI: ServerAPI}> = ({serverAPI}) => {
  backend.setServer(serverAPI);
  let [state, setState] = useLocalStorageState();

  let showCreateModal = () => {
    showModal(
      <UpsertModal
        title="Create Savestate"
        onConfirmClick={confirmCreate}
      />, window
    );
  }

  let confirmCreate = (text: string) => {
    backend.resolvePromise(backend.createSavestate(state.selectedGame, state.selectedProfile, text), (result: any) => {
      let _state = JSON.parse(JSON.stringify(state));
      _state.savestateList[result.id] = result
      _state.profileList[state.selectedProfile]["savestates"][result.id] = result
      _state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"][result.id] = result
      setState(_state);
    });
  }

  let showEditModal = (savestate_id: string, name: string) => {
    showModal(
      <UpsertModal
        title="Edit Savestate"
        onConfirmClick={confirmEdit(savestate_id)}
        textDefault={name}
      />, window
    );
  }

  let confirmEdit = (savestate_id: string) => {
    return function(text: string) {
      backend.resolvePromise(backend.renameSavestate(state.selectedGame, state.selectedProfile, savestate_id, text), () => {
        let _state = JSON.parse(JSON.stringify(state));
        _state.savestateList[savestate_id]["name"] = text;
        _state.profileList[state.selectedProfile]["savestates"][savestate_id]["name"] = text;
        _state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"][savestate_id]["name"] = text;
        setState(_state);
      });
    }
  }

  let showDeleteModal = (savestate_id: string) => {
    showModal(
      <DeleteModal
        title="Delete Savestate"
        description={`Are you sure you want to delete savestate ${state.savestateList[savestate_id]["name"]}?`}
        id={savestate_id}
        onConfirmClick={confirmDelete}
      />, window
    )
  }

  let confirmDelete = (savestate_id: string) => {
    backend.resolvePromise(backend.deleteProfile(state.selectedGame, savestate_id), () => {
      let _state = JSON.parse(JSON.stringify(state));
      delete _state.savestateList[savestate_id];
      delete _state.profileList[state.selectedProfile]["profiles"][savestate_id];
      delete _state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"][savestate_id];
      if(_state.selectedSavestate == savestate_id) {
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
        <DropdownItem
            label="Profile"
            rgOptions={!isEmpty(state.profileList) ? keys(state.profileList).map(key => ({
              data: key,
              label: state.profileList ? state.profileList[key]["name"] : ""
            })):[]}
            selectedOption={state.selectedProfile}
            onChange={(e) => selectProfile(e.data, state, setState)} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={showCreateModal}>
          Create Savestate
        </ButtonItem>
      </PanelSectionRow>
      {
        <PanelSectionRow>
          {
            !isEmpty(state.profileList) ?
              !isEmpty(state.savestateList) ? 
              (
                <ul style={{ listStyleType: 'none', padding: '1rem' }}>
                  {
                    values(state.savestateList).map((val: any) => {
                      return (
                        <li style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '10px', width: '100%', justifyContent: 'space-between' }}>
                          <span>
                            { val["name"] }
                          </span>
                          <DialogButton
                            style={{ height: '40px', width: '40px', padding: '10px 12px', minWidth: '40px' }}
                            onClick={(e: MouseEvent) =>
                              showContextMenu(
                                <Menu label="Savestate Actions">
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
              : "Select a profile"
            : "Select a game"
          }
        </PanelSectionRow>
      }
    </PanelSection>
  );
};

export { SavestatesPage };