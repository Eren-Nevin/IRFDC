import type { BackendHandler } from "./backend";
import { ExecutionStatus, ProxyAccount } from "./models";

export async function createProxy(
    backendHandler: BackendHandler,
    name: string,
) {

    const newProxy = new ProxyAccount(
        '',
        name,
        ExecutionStatus.RUNNING,
        '',
        '',
        true);

    const res = await backendHandler.createProxyAccount(newProxy);

    return res;
}

// TODO: Add pagination
export async function getProxies(backendHandler: BackendHandler, count: number = 100) {
    const res = await backendHandler.getProxyAccounts(count);
    if (res) {
        console.log(res);
        return res;
    }
}

export async function stopProxy(backendHandler: BackendHandler, proxyId: string) {
    const res = await backendHandler.changeProxyAccountExecutionStatus(proxyId, ExecutionStatus.STOPPED);
    return res;
}

export async function resumeProxy(backendHandler: BackendHandler, proxyId: string) {
    const res = await backendHandler.changeProxyAccountExecutionStatus(proxyId, ExecutionStatus.RUNNING);
    return res;
}
