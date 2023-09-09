import {
  ButtonItem,
  DialogButton,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  showModal,
} from "decky-frontend-lib";
import { VFC, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import {
  UpsertModal,
  DeleteModal,
  GameDropdown,
  ProfileDropdown,
} from "../components";
import { useSaveManagerState } from "../state";
import { values } from "../util";
import * as backend from "../backend";

const SavestatesPage: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  backend.setServer(serverAPI);
  let state = useSaveManagerState();

  let getList = () => {
    backend.resolvePromise(
      backend.getList("savestates", {
        key: "profile_id",
        value: state.selectedProfile,
      }),
      (res: object) => {
        state.setSavestates(res);
      }
    );
  };

  useEffect(() => {
    if (state.selectedProfile) {
      getList();
    }
  }, []);

  let showCreateModal = () => {
    showModal(
      <UpsertModal title="Create Savestate" onConfirmClick={confirmAdd} />,
      window
    );
  };

  let confirmAdd = (name: string, savestateID?: string) => {
    let id = savestateID ?? uuidv4();
    let savestate = {
      id: id,
      name: name,
      game_id: state.selectedGame,
      profile_id: state.selectedProfile,
      path: state.selectedGame
        ? state.games[state.selectedGame]["filePath"]
        : "",
    };
    backend.resolvePromise(backend.upsertSavestate(savestate), () => {
      state.upsertSavestate(savestate);
      getList();
    });
  };

  let showEditModal = (savestate_id: string, name: string) => {
    showModal(
      <UpsertModal
        title="Edit Savestate"
        onConfirmClick={confirmEdit(savestate_id)}
        textDefault={name}
      />,
      window
    );
  };

  let confirmEdit = (savestate_id: string) => {
    return async (name: string) => {
      await confirmAdd(name, savestate_id);
    };
  };

  let showDeleteModal = (
    game_id: string,
    profile_id: string,
    savestate_id: string,
    name: string
  ) => {
    showModal(
      <DeleteModal
        title="Delete Savestate"
        description={`Are you sure you want to delete savestate ${name}?`}
        id={savestate_id}
        onConfirmClick={confirmDelete(game_id, profile_id)}
      />,
      window
    );
  };

  let confirmDelete = (game_id: string, profile_id: string) => {
    return (savestate_id: string) => {
      backend.resolvePromise(
        backend.deleteSavestate(game_id, profile_id, savestate_id),
        () => {
          state.deleteSavestate(savestate_id);
          getList();
        }
      );
    };
  };
  return (
    <PanelSection>
      <PanelSectionRow>
        <GameDropdown state={state} serverAPI={serverAPI} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ProfileDropdown state={state} serverAPI={serverAPI} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={showCreateModal}>Create Savestate</ButtonItem>
      </PanelSectionRow>
      {
        <PanelSectionRow>
          {state.selectedGame != null ? (
            state.selectedProfile != null ? (
              <ul style={{ listStyleType: "none", padding: "1rem" }}>
                {values(state.savestates).map((savestate: any) => {
                  return (
                    <li
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingBottom: "10px",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{savestate["name"]}</span>
                      <DialogButton
                        style={{
                          height: "40px",
                          width: "40px",
                          padding: "10px 12px",
                          minWidth: "40px",
                        }}
                        onClick={(e: MouseEvent) =>
                          showContextMenu(
                            <Menu label="Savestate Actions">
                              <MenuItem
                                onSelected={() => {
                                  showEditModal(
                                    savestate["id"],
                                    savestate["name"]
                                  );
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                onSelected={() => {
                                  showDeleteModal(
                                    savestate["game_id"],
                                    savestate["profile_id"],
                                    savestate["id"],
                                    savestate["name"]
                                  );
                                }}
                              >
                                Delete
                              </MenuItem>
                            </Menu>,
                            e.currentTarget ?? window
                          )
                        }
                      >
                        <FaEllipsisH />
                      </DialogButton>
                    </li>
                  );
                })}
              </ul>
            ) : (
              "Select a profile"
            )
          ) : (
            "Select a game"
          )}
        </PanelSectionRow>
      }
    </PanelSection>
  );
};

export { SavestatesPage };
