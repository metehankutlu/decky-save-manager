import {
  DropdownItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  staticClasses,
  ButtonItem,
  SidebarNavigation
} from "decky-frontend-lib";
import { useEffect, VFC } from "react";
import { SharedStateProvider, useSharedState } from "./state";
import { selectGame, selectProfile } from "./util";
import { FaShip } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI}> = ({serverAPI}) => {

  const [state, setState] = useSharedState();

  useEffect(() => {
    serverAPI.callPluginMethod('get_data', {}).then((result) => {
      if(result.success) {
        let gameList = result.result;
        let runningApp = Router.MainRunningApp;
        let runningAppIsAvailable = runningApp && Object.keys(gameList).includes(runningApp.appid.toString());
        setState({...state,
          gameList: gameList, 
          selectedGame: runningApp && runningAppIsAvailable ? runningApp.appid.toString() : "",
          profileList: runningApp && runningAppIsAvailable ? gameList[runningApp.appid.toString()]["profiles"] : {},
        });
      }
    });
  }, []);

  let isEmpty = (obj: Object) => {
    return Object.keys(obj).length == 0
  }

  let loadSavestate = () => {
    console.log(state);
  }

  return (
    <PanelSection>
      <PanelSectionRow>
        <DropdownItem
          label="Game"
          rgOptions={!isEmpty(state.gameList) ? Object.keys(state.gameList).map(key => ({
            data: key,
            label: state.gameList[key]["name"]
          })):[]}
          selectedOption={state.selectedGame}
          onChange={(e) => selectGame(e.data)} />
      </PanelSectionRow>
      <PanelSectionRow>
        <DropdownItem
          label="Profile"
          rgOptions={!isEmpty(state.profileList) ? Object.keys(state.profileList).map(key => ({
            data: key,
            label: state.profileList[key]["name"]
          })):[]}
          selectedOption={state.selectedProfile}
          onChange={(e) => selectProfile(e.data)} />
      </PanelSectionRow>
      <PanelSectionRow>
        <DropdownItem
          label="Savestate"
          rgOptions={!isEmpty(state.savestateList) ? Object.keys(state.savestateList).map(key => ({
            data: key,
            label: state.savestateList[key]["name"]
          })):[]}
          selectedOption={state.selectedSavestate}
          onChange={(e) => setState({...state, selectedSavestate: e.data})} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={loadSavestate}>
          Load Savestate
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => {
          Router.CloseSideMenus();
          Router.Navigate("/save-manager")
        }}>
          Manage Profiles & Savestates
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const ProfilesPage: VFC = () => {
  return (
    <div>
      Profiles
    </div>
  );
};

const SavestatesPage: VFC = () => {
  return (
    <div>
      Savestates
    </div>
  );
};

const SaveManagerRouter: VFC = () => {
  return (
    <SidebarNavigation
      title="Save Manager"
      showTitle
      pages={[
        {
          title: "Profiles",
          content: <ProfilesPage />,
          route: "/save-manager/profiles",
        },
        {
          title: "Savestates",
          content: <SavestatesPage />,
          route: "/save-manager/savestates",
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
      <SharedStateProvider>
        <SaveManagerRouter />
      </SharedStateProvider>
    )
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: (
      <SharedStateProvider>
        <Content serverAPI={serverApi} />
      </SharedStateProvider>
    ),
    icon: <FaShip />,
    onDismount() {
      serverApi.routerHook.removeRoute("/save-manager");
    },
  };
});
