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