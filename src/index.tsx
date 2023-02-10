import {
  DropdownItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  staticClasses,
  ButtonItem,
  SidebarNavigation,
  showModal,
  ConfirmModal
} from "decky-frontend-lib";
import { VFC } from "react";
import useLocalStorageState from "./state";
import { values } from "./util";
import { GamesPage, ProfilesPage, SavestatesPage } from "./pages";
import { FaShip } from "react-icons/fa";
import * as backend from "./backend";

const Content: VFC<{ serverAPI: ServerAPI}> = ({serverAPI}) => {
  backend.setServer(serverAPI);

  const [state, setState] = useLocalStorageState();

  let loadSavestate = () => {
    if (state.selectedGame != "" && state.selectedProfile != "" && state.selectedSavestate != ""){
      backend.resolvePromise(backend.loadSavestate(
        state.selectedGame, 
        state.selectedProfile, 
        state.selectedSavestate,
        state.gameList[state.selectedGame]["filePath"]
      ), () => {
        showModal(
          <ConfirmModal strTitle="Savestate is Loaded" bCancelDisabled={true} />, window
        )
      });
    }
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
          onChange={(e) => {
            setState({...state, 
              selectedGame: e.data, 
              selectedProfile: state.selectedGame == e.data ? state.selectedProfile : "",
              selectedSavestate: state.selectedGame == e.data ? state.selectedSavestate : ""
            });
          }} />
      </PanelSectionRow>
      <PanelSectionRow>
        <DropdownItem
          label="Profile"
          rgOptions={state.selectedGame != "" ?
            values(state.gameList[state.selectedGame]["profiles"]).map((value: any) => ({
              data: value["id"],
              label: value["name"]
            })):[]}
          selectedOption={state.selectedProfile}
          onChange={(e) => {
            setState({...state, 
              selectedProfile: e.data,
              selectedSavestate: state.selectedProfile == e.data ? state.selectedSavestate : ""
            });
          }} />
      </PanelSectionRow>
      <PanelSectionRow>
        <DropdownItem
          label="Savestate"
          rgOptions={state.selectedGame != "" && state.selectedProfile != "" ?
            values(state.gameList[state.selectedGame]["profiles"][state.selectedProfile]["savestates"]).map((value: any) => ({
              data: value["id"],
              label: value["name"]
            })):[]}
          selectedOption={state.selectedSavestate}
          onChange={(e) => setState({...state, selectedSavestate: e.data})} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={loadSavestate}>
          Load
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => {
          Router.CloseSideMenus();
          Router.Navigate("/save-manager")
        }}>
          Manage
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const SaveManagerRouter: VFC<{ serverAPI: ServerAPI}> = ({serverAPI}) => {
  return (
    <SidebarNavigation
      title="Save Manager"
      showTitle
      pages={[
        {
          title: "Savestates",
          content: <SavestatesPage serverAPI={serverAPI} />,
          route: "/save-manager/savestates",
        },
        {
          title: "Profiles",
          content: <ProfilesPage serverAPI={serverAPI} />,
          route: "/save-manager/profiles",
        },
        {
          title: "Games",
          content: <GamesPage serverAPI={serverAPI} />,
          route: "/save-manager/games",
        },
        // {
        //   title: "Uninstall",
        //   content: <UninstallPage />,
        //   route: "/save-manager/uninstall",
        // },
        // {
        //   title: "About Save Manager",
        //   content: <AboutPage />,
        //   route: "/save-manager/about",
        // },
      ]}
    />
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  serverApi.routerHook.addRoute("/save-manager", () => {
    return (
        <SaveManagerRouter serverAPI={serverApi} />
    )
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: (
        <Content serverAPI={serverApi} />
    ),
    icon: <FaShip />,
    alwaysRender: true,
    onDismount() {
      serverApi.routerHook.removeRoute("/save-manager");
    },
  };
});
