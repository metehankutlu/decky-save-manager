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
import { UpsertModal, DeleteModal, GameDropdown } from "../components";
import { useSaveManagerState } from "../state";
import { values } from "../util";
import * as backend from "../backend";

const ProfilesPage: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  backend.setServer(serverAPI);
  let state = useSaveManagerState();

  let getList = () => {
    backend.resolvePromise(
      backend.getList("profiles", {
        key: "game_id",
        value: state.selectedGame,
      }),
      (res: object) => {
        state.setProfiles(res);
      }
    );
  };

  useEffect(() => {
    if (state.selectedGame) {
      getList();
    }
  }, []);

  let showCreateModal = () => {
    showModal(
      <UpsertModal title="Create Profile" onConfirmClick={confirmAdd} />,
      window
    );
  };

  let confirmAdd = async (name: string, profileID?: string) => {
    let id = profileID ?? uuidv4();
    let profile = {
      id: id,
      name: name,
      game_id: state.selectedGame,
    };
    backend.resolvePromise(backend.upsertProfile(profile), () => {
      state.upsertProfile(profile);
      getList();
    });
  };

  let showEditModal = (profile_id: string, name: string) => {
    showModal(
      <UpsertModal
        title="Edit Profile"
        onConfirmClick={confirmEdit(profile_id)}
        textDefault={name}
      />,
      window
    );
  };

  let confirmEdit = (profile_id: string) => {
    return async (name: string) => {
      await confirmAdd(name, profile_id);
    };
  };

  let showDeleteModal = (game_id: string, profile_id: string, name: string) => {
    showModal(
      <DeleteModal
        title="Delete Profile"
        description={`Are you sure you want to delete profile ${name}?`}
        id={profile_id}
        onConfirmClick={confirmDelete(game_id)}
      />,
      window
    );
  };

  let confirmDelete = (game_id: string) => {
    return (profile_id: string) => {
      backend.resolvePromise(backend.deleteProfile(game_id, profile_id), () => {
        state.deleteGame(game_id);
        getList();
      });
    };
  };

  return (
    <PanelSection>
      <PanelSectionRow>
        <GameDropdown state={state} serverAPI={serverAPI} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={showCreateModal}>Create Profile</ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        {state.selectedGame ? (
          <ul style={{ listStyleType: "none", padding: "1rem" }}>
            {values(state.profiles).map((profile: any) => {
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
                  <span>{profile["name"]}</span>
                  <DialogButton
                    style={{
                      height: "40px",
                      width: "40px",
                      padding: "10px 12px",
                      minWidth: "40px",
                    }}
                    onClick={(e: MouseEvent) =>
                      showContextMenu(
                        <Menu label="Profile Actions">
                          <MenuItem
                            onSelected={() => {
                              showEditModal(profile["id"], profile["name"]);
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onSelected={() => {
                              showDeleteModal(
                                profile["game_id"],
                                profile["id"],
                                profile["name"]
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
          "Select a game"
        )}
      </PanelSectionRow>
    </PanelSection>
  );
};

export { ProfilesPage };
