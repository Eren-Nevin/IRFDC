import type { BackendHandler } from "./backend";
import { ExecutionPerscription } from "./models";

// TODO: Replace default 100 with pagination

export async function createExecutionPerscription(
    backendHandler: BackendHandler,
    appletId: string,
    proxyId: string,
    cron: string,
    metadata: string,
    active: boolean = true,
) {

    const newExecutionPerscription = new ExecutionPerscription(
        '0',
        proxyId,
        appletId,
        cron,
        metadata,
        active,
    );


    const res = await backendHandler.createExecutionPerscription(newExecutionPerscription);

    newExecutionPerscription.uid = res;
    return newExecutionPerscription;
}

export async function installApplet(
    backendHandler: BackendHandler,
    appletId: string,
    proxyId: string,
    cron: string,
) {
    const eP = await createExecutionPerscription(backendHandler, appletId, proxyId, cron, '');
    return eP;
}

export async function getMyExecutionPerscriptions(backendHandler: BackendHandler) {
    const res = await backendHandler.getMyExecutionPerscriptions(100);
    return res;
}

export async function getMyExecutionPerscriptionsByProxy(backendHandler: BackendHandler, proxyId: string) {
    const res = await backendHandler.getMyExecutionPerscriptionsByProxy(proxyId, 100);
    return res;
}

export async function getPerscriptionLogs(backendHandler: BackendHandler, perscriptionId: string) {
    const res = await backendHandler.getExecutionPerscriptionLogs(perscriptionId, 100);
    return res;
}

