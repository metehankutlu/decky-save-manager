import {
  ButtonItem,
  DialogButton,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  showContextMenu,
  showModal,
} from "decky-frontend-lib";
import { VFC, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { DeleteModal, UpsertModal } from "../components";
import { openFilePicker, values } from "../util";
import * as backend from "../backend";
import { useSaveManagerState } from "../state";
import { FaEllipsisH } from "react-icons/fa";

const GamesPage: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  backend.setServer(serverAPI);
  let state = useSaveManagerState();

  let getList = () => {
    backend.resolvePromise(backend.getList("games"), (res: object) => {
      state.setGames(res);
    });
  };

  useEffect(() => {
    getList();
  }, []);

  let showAddModal = () => {
    showModal(
      <UpsertModal
        title="Add Game"
        filePicker="/home/deck"
        onConfirmClick={confirmAdd}
        serverAPI={serverAPI}
      />,
      window
    );
  };

  let confirmAdd = async (name: string, filePath?: string, appID?: string) => {
    let id = appID ?? uuidv4();
    let game = {
      id: id,
      name: name,
      filePath: filePath,
    };
    backend.resolvePromise(backend.upsertGame(game), () => {
      state.upsertGame(game);
      getList();
    });
  };

  let showEditModal = (id: string, name: string, filePath: string) => {
    showModal(
      <UpsertModal
        title="Edit Game"
        filePicker={filePath}
        onConfirmClick={confirmEdit(id)}
        serverAPI={serverAPI}
        textDefault={name}
      />,
      window
    );
  };

  let confirmEdit = (id: string) => {
    return async (name: string, filePath?: string) => {
      await confirmAdd(name, filePath, id);
    };
  };

  let showDeleteModal = (game_id: string, name: string) => {
    showModal(
      <DeleteModal
        title="Delete Game"
        description={`Are you sure you want to delete game ${name}?`}
        id={game_id}
        onConfirmClick={confirmDelete}
      />,
      window
    );
  };

  let confirmDelete = (game_id: string) => {
    backend.resolvePromise(backend.deleteGame(game_id), () => {
      state.deleteGame(game_id);
      getList();
    });
  };

  return (
    <PanelSection>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={showAddModal}>
          Add Game
        </ButtonItem>
        {Router.MainRunningApp && !Object.keys(state.games).find(id => id == Router.MainRunningApp?.appid.toString()) && (
          <ButtonItem
            layout="below"
            onClick={() => {
              openFilePicker(
                "/home/deck/.local/share/Steam/steamapps/compatdata/570940/pfx/drive_c/users/steamuser/Documents/NBGI/DARK SOULS REMASTERED/",
                undefined,
                undefined,
                undefined,
                serverAPI
              ).then((response) => {
                let app = Router.MainRunningApp;
                confirmAdd(
                  app?.display_name ?? "",
                  response.realpath,
                  app?.appid.toString() ?? ""
                );
              });
            }}
          >
            Add Current Game
          </ButtonItem>
        )}
      </PanelSectionRow>
      <PanelSectionRow>
        <ul style={{ listStyleType: "none", padding: "1rem" }}>
          {values(state.games).map((game: any) => {
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
                <span>{game["name"]}</span>
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
                            showEditModal(
                              game["id"],
                              game["name"],
                              game["filePath"]
                            );
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onSelected={() => {
                            showDeleteModal(game["id"], game["name"]);
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
      </PanelSectionRow>
    </PanelSection>
  );
};

export { GamesPage };
