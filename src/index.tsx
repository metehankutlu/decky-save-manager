import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  staticClasses,
  ButtonItem,
  SidebarNavigation,
  showModal,
  ConfirmModal,
} from "decky-frontend-lib";
import { VFC } from "react";
import {
  SaveManagerContextProvider,
  SaveManagerState,
  useSaveManagerState,
} from "./state";
import { GamesPage, ProfilesPage, SavestatesPage } from "./pages";
import { FaSave } from "react-icons/fa";
import * as backend from "./backend";
import { GameDropdown, ProfileDropdown, SavestateDropdown } from "./components";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  backend.setServer(serverAPI);

  let state = useSaveManagerState();

  let loadSavestate = () => {
    if (
      state.selectedGame &&
      state.selectedProfile &&
      state.selectedSavestate
    ) {
      backend.resolvePromise(
        backend.loadSavestate(state.selectedSavestate),
        () => {
          showModal(
            <ConfirmModal
              strTitle="Savestate is Loaded"
              bCancelDisabled={true}
              onOK={() => {
                Router.CloseSideMenus();
              }}
            />,
            window
          );
        }
      );
    }
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
        <SavestateDropdown state={state} serverAPI={serverAPI} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={loadSavestate}>
          Load
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Router.CloseSideMenus();
            Router.Navigate("/save-manager");
          }}
        >
          Manage
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const SaveManagerRouter: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
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
  const state = new SaveManagerState();
  serverApi.routerHook.addRoute("/save-manager", () => {
    return (
      <SaveManagerContextProvider saveManagerStateClass={state}>
        <SaveManagerRouter serverAPI={serverApi} />
      </SaveManagerContextProvider>
    );
  });

  return {
    title: <div className={staticClasses.Title}>Save Manager</div>,
    content: (
      <SaveManagerContextProvider saveManagerStateClass={state}>
        <Content serverAPI={serverApi} />
      </SaveManagerContextProvider>
    ),
    icon: <FaSave />,
    alwaysRender: true,
    onDismount() {
      serverApi.routerHook.removeRoute("/save-manager");
    },
  };
});
