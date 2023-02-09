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

  let confirmCreate = (name: string) => {
    let id = uuidv4();
    backend.resolvePromise(backend.createSavestate(state.selectedGame, 
                                                   state.selectedProfile, 
                                                   id, 
                                                   state.gameList[state.selectedGame]["filePath"]), () => {
      let _state = JSON.parse(JSON.stringify(state));
      _state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"][id] = {
        id: id,
        name: name
      }
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
        let _state = JSON.parse(JSON.stringify(state));
        _state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"][savestate_id]["name"] = text;
        setState(_state);
    }
  }

  let showDeleteModal = (savestate_id: string) => {
    showModal(
      <DeleteModal
        title="Delete Savestate"
        description={`Are you sure you want to delete savestate ${state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"][savestate_id]["name"]}?`}
        id={savestate_id}
        onConfirmClick={confirmDelete}
      />, window
    )
  }

  let confirmDelete = (savestate_id: string) => {
    backend.resolvePromise(backend.deleteSavestate(state.selectedGame, state.selectedProfile, savestate_id), () => {
      let _state = JSON.parse(JSON.stringify(state));
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
            rgOptions={values(state.gameList).map((value: any) => ({
              data: value["id"],
              label: value["name"]
            }))}
            selectedOption={state.selectedGame}
            onChange={(e) => setState({...state, selectedGame: e.data, selectedProfile: "", selectedSavestate: ""})} />
      </PanelSectionRow>
      <PanelSectionRow>
        <DropdownItem
            label="Profile"
            rgOptions={state.selectedGame != "" ? values(state.gameList[state.selectedGame]["profiles"]).map((value: any)=> ({
              data: value["id"],
              label: value["name"]
            })):[]}
            selectedOption={state.selectedProfile}
            onChange={(e) => setState({...state, selectedProfile: e.data, selectedSavestate: ""})} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={showCreateModal}>
          Create Savestate
        </ButtonItem>
      </PanelSectionRow>
      {
        <PanelSectionRow>
          {
            state.selectedGame != "" ?
              state.selectedProfile != "" ? 
              (
                <ul style={{ listStyleType: 'none', padding: '1rem' }}>
                  {
                    values(state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"]).map((savestate: any) => {
                      return (
                        <li style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '10px', width: '100%', justifyContent: 'space-between' }}>
                          <span>
                            { savestate["name"] }
                          </span>
                          <DialogButton
                            style={{ height: '40px', width: '40px', padding: '10px 12px', minWidth: '40px' }}
                            onClick={(e: MouseEvent) =>
                              showContextMenu(
                                <Menu label="Savestate Actions">
                                  <MenuItem onSelected={() => {setState({...state, selectedSavestate: savestate["id"]})}}>
                                    Select
                                  </MenuItem>
                                  <MenuItem onSelected={() => {showEditModal(savestate["id"], savestate["name"])}}>
                                    Edit
                                  </MenuItem>
                                  <MenuItem onSelected={() => {showDeleteModal(savestate["id"])}}>
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