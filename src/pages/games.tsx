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
import { VFC } from "react";
import { v4 as uuidv4 } from "uuid";
import { DeleteModal, UpsertModal } from "../components";
import { openFilePicker, values } from "../util";
import * as backend from "../backend";
import useLocalStorageState from "../state";
import { FaEllipsisH } from "react-icons/fa";

const GamesPage: VFC<{ serverAPI: ServerAPI}> = ({serverAPI}) => {
    backend.setServer(serverAPI);
    let [state, setState] = useLocalStorageState();

    let showAddModal = () => {
        showModal(
            <UpsertModal
                title="Add Game"
                filePicker="/home/deck"
                onConfirmClick={confirmAdd}
                serverAPI={serverAPI}
            />, window
        )
    }

    let confirmAdd = (name: string, filePath?: string, appID?: string) => {
        let id = appID ?? uuidv4();
        let _state = JSON.parse(JSON.stringify(state));
        _state.gameList[id] = {
            id: id,
            name: name,
            filePath: filePath,
            profiles: {}
        };
        setState(_state);
    }

    let showEditModal = (id: string, name: string, filePath: string) => {
        showModal(
            <UpsertModal
                title="Edit Game"
                filePicker={filePath}
                onConfirmClick={confirmEdit(id)}
                serverAPI={serverAPI}
                textDefault={name}
            />, window
        )
    }

    let confirmEdit = (id: string) => {
        return (name: string, filePath?: string) => {
            let _state = JSON.parse(JSON.stringify(state));
            _state.gameList[id] = {
                id: id,
                name: name,
                filePath: filePath,
                profiles: {}
            };
            setState(_state);
        }
    }

    let showDeleteModal = (game_id: string) => {
        showModal(
        <DeleteModal
            title="Delete Game"
            description={`Are you sure you want to delete game ${state.gameList[game_id]["name"]}?`}
            id={game_id}
            onConfirmClick={confirmDelete}
        />, window
        )
    }

    let confirmDelete = (game_id: string) => {
        backend.resolvePromise(backend.deleteGame(game_id), () => {
            let _state = JSON.parse(JSON.stringify(state));
            delete _state.gameList[game_id];
            if(_state.selectedGame == game_id) {
                _state.selectedGame = "";
                _state.selectedProfile = "";
                _state.selectedSavestate = "";
            }
            setState(_state);
        });
    }

    return (
        <PanelSection>
            <PanelSectionRow>
                <ButtonItem layout="below" onClick={showAddModal}>
                    Add Game
                </ButtonItem>
                {
                    Router.MainRunningApp &&
                    <ButtonItem layout="below" onClick={() => {
                        openFilePicker('/home/deck/.local/share/Steam/steamapps/compatdata/570940/pfx/drive_c/users/steamuser/Documents/NBGI/DARK SOULS REMASTERED/', undefined, undefined, undefined, serverAPI).then(response => {
                            let app = Router.MainRunningApp;
                            confirmAdd(
                                app?.display_name ?? '',
                                response.realpath,
                                app?.appid.toString() ?? ''
                            );
                        })
                    }}>
                        Add Current Game
                    </ButtonItem>
            }
            </PanelSectionRow>
            <PanelSectionRow>
                <ul style={{ listStyleType: 'none', padding: '1rem' }}>
                    {
                        values(state.gameList).map((game: any) => {
                            return (
                                <li style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '10px', width: '100%', justifyContent: 'space-between' }}>
                                    <span>
                                        { game["name"] }
                                    </span>
                                    <DialogButton
                                        style={{ height: '40px', width: '40px', padding: '10px 12px', minWidth: '40px' }}
                                        onClick={(e: MouseEvent) =>
                                            showContextMenu(
                                                <Menu label="Profile Actions">
                                                    <MenuItem onSelected={() => {showEditModal(game["id"], game["name"], game["filePath"])}}>
                                                        Edit
                                                    </MenuItem>
                                                    <MenuItem onSelected={() => {showDeleteModal(game["id"])}}>
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
            </PanelSectionRow>
        </PanelSection>
    )
}

export { GamesPage };