import { ServerAPI } from "decky-frontend-lib";

var server: ServerAPI | undefined = undefined;

export function resolvePromise(promise: Promise<any>, callback: any) {
  (async function () {
    let data = await promise;
    console.log(data);
    if (data.success) {
      callback(data.result);
    } else console.log("failed to call backend");
  })();
}

export function callBackendFunction(promise: Promise<any>) {
  (async function () {
    await promise;
  })();
}

export function setServer(s: ServerAPI) {
  server = s;
}

export function getList(collection_name: string, condition: object | null  = null): Promise<any> {
  return server!.callPluginMethod("get_list", {
    collection_name: collection_name,
    condition: condition
  });
}

export function upsertGame(game: object): Promise<any> {
  return server!.callPluginMethod("upsert_game", {
    game: game,
  });
}

export function upsertProfile(profile: object): Promise<any> {
  return server!.callPluginMethod("upsert_profile", {
    profile: profile,
  });
}

export function upsertSavestate(savestate: object): Promise<any> {
  return server!.callPluginMethod("upsert_savestate", {
    savestate: savestate,
  });
}

export function loadSavestate(savestate_id: string): Promise<any> {
  return server!.callPluginMethod("load_savestate", {
    savestate_id: savestate_id.toString(),
  });
}

export function deleteGame(game_id: string): Promise<any> {
  return server!.callPluginMethod("delete_game", {
    game_id: game_id.toString(),
  });
}

export function deleteProfile(
  game_id: string,
  profile_id: string
): Promise<any> {
  return server!.callPluginMethod("delete_profile", {
    game_id: game_id.toString(),
    profile_id: profile_id.toString(),
  });
}

export function deleteSavestate(
  game_id: string,
  profile_id: string,
  savestate_id: string
): Promise<any> {
  return server!.callPluginMethod("delete_savestate", {
    game_id: game_id.toString(),
    profile_id: profile_id.toString(),
    savestate_id: savestate_id.toString(),
  });
}
