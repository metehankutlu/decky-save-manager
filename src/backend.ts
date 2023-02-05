import { ServerAPI } from "decky-frontend-lib"

var server: ServerAPI | undefined = undefined;

export function resolvePromise(promise: Promise<any>, callback: any) {
    (async function () {
        let data = await promise;
        if (data.success) {
            console.log(data);
            callback(data.result);
        }
        else 
            console.log("failed to call backend")
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

export function getData(): Promise<any> {
    return server!.callPluginMethod("get_data", {});
}

export function createProfile(app_id: string, name: string): Promise<any> {
    return server!.callPluginMethod("create_profile", {app_id: app_id, name: name});
}

export function deleteProfile(app_id: string, profile_id: string): Promise<any> {
    return server!.callPluginMethod("delete_profile", {app_id: app_id, profile_id: profile_id});
}

export function renameProfile(app_id: string, profile_id: string, name: string): Promise<any> {
    return server!.callPluginMethod("rename_profile", {app_id: app_id, profile_id: profile_id, name: name});
}

export function createSavestate(app_id: string, profile_id: string, name: string): Promise<any> {
    return server!.callPluginMethod("create_savestate", {app_id: app_id, profile_id: profile_id, name: name});
}

export function deleteSavestate(app_id: string, profile_id: string, savestate_id: string): Promise<any> {
    return server!.callPluginMethod("delete_savestate", {app_id: app_id, profile_id: profile_id, savestate_id: savestate_id});
}

export function renameSavestate(app_id: string, profile_id: string, savestate_id: string, name: string): Promise<any> {
    return server!.callPluginMethod("rename_savestate", {app_id: app_id, profile_id: profile_id, savestate_id: savestate_id, name: name});
}

export function loadSavestate(app_id: string, profile_id: string, savestate_id: string): Promise<any> {
    return server!.callPluginMethod("load_savestate", {app_id: app_id, profile_id: profile_id, savestate_id: savestate_id});
}