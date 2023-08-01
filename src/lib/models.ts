export class AppData {
    constructor(
        public authDatas: AuthData[],
        public proxyAccounts: ProxyAccount[],
        public dapps: DApp[],
        public appStoreApps: Applet[],
        public dynamicAccess: DynamicAccess
    ) { }
}



export enum SupportedChains {
    EVM = 0,
    SOLANA = 1,
    BITCOIN = 2,
}

export const enum AppletType {
    GENERAL = 0,
    PUBLIC = 1,
}

export const enum AppletVisibility {
    PRIVATE = 0,
    PUBLIC = 1,
}

export const enum ExecutionStatus {
    RUNNING = 0,
    STOPPED = 1,
}

export class DApp {
    constructor(
        public name: string,
        public url: string,
        public address: string,
    ) { }
}

// TODO: Add creationDate
// TODO: Add AppletCompabilityVersion
export class Applet {
    constructor(
        public uid: string,
        // NOTE: Should we convert script to the real object returned by server or just parse the string part in de/serialization as we're doing now?
        public script: string,
        public owner: string,
        // TODO: PUBLIC, PRIVATE
        public visibility: AppletVisibility,
        // TODO: GENERAL, Permission
        public appletType: AppletType,

        // NOTE: These are all metadata
        public name: string,
        public developer: string,
        public url: string,
        public logoUrl: string,
        public description: string,
        public shortDescription: string,
        public rating: string,
        public updates: string,
        public installNotes: string,
        public uninstallNotes: string,
    ) { }
}

export class ProxyAccount {

    constructor(
        public uid: string,
        public name: string,
        public status: ExecutionStatus,
        public mnemonica: string,
        public createdData: string,
        public active: boolean,
    ) { }
}

export class ExecutionPerscription {
    constructor(
        public uid: string,
        public proxyAccountId: string,
        public appletId: string,
        public cron: string,
        public metadata: string,
        public active: boolean,
    ) { }
}


export class Delegation {

    constructor(
        public token: string,
        public amount: string) { }
}

// TODO: Later, for now user manually gets it by adding the proxy account to wallet
// export class Balance

export class DynamicAccess {
    constructor(
        public code: string
    ) { }
}

export class AuthData {
    constructor(
        public did: string,
        public content: string,
        public accessedBy: string[],
        public contractAddress: string,
    ) { }
}
