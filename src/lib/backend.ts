import { Applet, ExecutionPerscription, ExecutionStatus, ProxyAccount, SupportedChains } from "./models"
import { SERVER_ADDRESS } from "./utils"

// TOOD: Add https
// TODO: Fix returning 500 error if server is not running
export class BackendHandler {
    readonly adapter: DataAdapter

    authToken: string

    // TODO: add https
    readonly serverAddress: string = SERVER_ADDRESS

    readonly baseApiEndPoint = '/api/v1'

    readonly proxyAccountEndpoints = {
        getProxyAccounts: `${this.baseApiEndPoint}/proxy-account/get-my-proxy-accounts`,
        createProxyAccount: `${this.baseApiEndPoint}/proxy-account/create-new-proxy-account`,
        getProxyAccountAddress: `${this.baseApiEndPoint}/proxy-account/get-address-for-proxy-account`,
        changeProxyAccountExecutionStatus: `${this.baseApiEndPoint}/proxy-account/change-proxy-account-execution-status`,
    }

    readonly appletEndpoints = {
        getAllApplets: `${this.baseApiEndPoint}/applets/get-all-applets`,
        getAllMyApplets: `${this.baseApiEndPoint}/applets/get-all-my-applets`,
        publishNewApplet: `${this.baseApiEndPoint}/applets/publish-new-applet`,
    }

    // TODO: Tell backend to create a new execution perscription endpoint
    readonly executionPerscriptionEndpoints = {
        getMyExecutionsPerscriptions: `${this.baseApiEndPoint}/applets/get-all-my-execution-perscriptions`,
        getMyExecutionPerscriptionsByProxy: `${this.baseApiEndPoint}/applets/get-all-my-execution-perscriptions-by-proxy-id`,
        createExectuionPerscription: `${this.baseApiEndPoint}/applets/create-execution-perscription`,
        getExecutionPerscriptionLogs: `${this.baseApiEndPoint}/applets/get-logs-for-execution-perscription`,
    }

    readonly userEndpoints = {
        getMyProfile: `${this.baseApiEndPoint}/users/get-my-profile`
    }

    constructor(authToken: string) {
        this.authToken = authToken
        this.adapter = new DataAdapter()
    }

    // loadTokenFromStorage() {
    //     const savedToken = localStorage.getItem('token');
    //     if (savedToken) {
    //         this.token = savedToken
    //     } else {
    //         throw new Error('No token found in local storage')
    //     }
    // }
    //

    // TODO: Add Error Handling
    async createProxyAccount(proxyAccount: ProxyAccount) {
        const res = await fetch(this.serverAddress + this.proxyAccountEndpoints.createProxyAccount, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authToken,
            },
            body: JSON.stringify({ name: proxyAccount.name }),
        });

        if (res.status === 200) {
            console.log('Proxy Account Created')
            const rawRes = await res.json()
            console.log(rawRes)
            return rawRes['data']
        }
    }


    // TODO: Add Error Handling
    async getProxyAccounts(count: number, offset?: number) {
        const url = this.serverAddress + this.proxyAccountEndpoints.getProxyAccounts + `?count=${count}`;
        if (offset) {
            url + `&offset=${offset}`
        }
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authToken,
                },
            });

            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                return this.adapter.convertReceivedProxyAccounts(rawRes['data']);
            } else {
                console.error('Error fetching proxy accounts')
                return [];
            }
        } catch (e) {
            console.error(e)
            return [];
        }

    }

    async getProxyAccountAddress(uid: string, chain: SupportedChains) {
        const res = await fetch(this.serverAddress + this.proxyAccountEndpoints.getProxyAccountAddress + `?chain=${chain}&ProxyAccountId=${uid}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.authToken,
            }
        });

        if (res.status === 200) {
            const rawRes = await res.json()
            console.log(rawRes)
            return rawRes['data'];
        }
    }

    // TODO: Doesn't work. Says user is not the owner of the proxy account
    async changeProxyAccountExecutionStatus(uid: string, status: ExecutionStatus) {
        try {
            const res = await fetch(this.serverAddress + this.proxyAccountEndpoints.changeProxyAccountExecutionStatus + `?proxyId=${uid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authToken,
                },
                body: JSON.stringify(status),
            });
            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                return rawRes['data'];
            }
            else {
                console.error('Error changing proxy account execution status')
                console.error(await res.text())
                return false;
            }
        }
        catch (e) {
            console.error(e)
            return false;
        }
    }

    // Applets
    //

    async getAllApplets(count: number, offset?: number) {
        const url = this.serverAddress + this.appletEndpoints.getAllApplets + `?count=${count}`;

        if (offset) {
            url + `&offset=${offset}`
        }
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authToken,
            },
        });

        if (res.status === 200) {
            const rawRes = await res.json()
            console.log(rawRes)
            const applets = this.adapter.convertReceivedApplets(rawRes['data']);
            return applets;
        }
        else {
            console.error('Error fetching applets')
            return [];
        }

    }

    // TODO: Fix in backend
    async getMyApplets(count: number, offset?: number) {
        const url = this.serverAddress + this.appletEndpoints.getAllMyApplets + `?count=${count}`;
        if (offset) {
            url + `&offset=${offset}`
        }
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authToken,
                },
            });

            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                return this.adapter.convertReceivedApplets(rawRes['data']);
            } else {
                return [];
            }
        } catch (e) {
            console.error(e)
            return [];
        }
    }

    async publishNewApplet(applet: Applet) {
        try {
            const serializedApplet = JSON.stringify(this.adapter.convertAppletForSending(applet));

            console.log(serializedApplet);
            const res = await fetch(this.serverAddress + this.appletEndpoints.publishNewApplet, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authToken,
                },
                body: serializedApplet,
            });

            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                // This is the uid of generated applet
                return rawRes['data'];
            } else {
                console.error('Error publishing new applet')
                console.error(await res.text())
            }
        } catch (e) {
            console.error(e)
        }
    }

    // TODO: Implement
    async getMyExecutionPerscriptions(count: number, offset?: number) {
        try {
            const url = this.serverAddress + this.executionPerscriptionEndpoints.getMyExecutionsPerscriptions + `?count=${count}`;
            if (offset) {
                url + `&offset=${offset}`
            }
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authToken,
                },
            });

            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                return this.adapter.convertReceivedExecutionPerscriptions(rawRes['data']);
            }
            else {
                console.error('Error fetching execution perscriptions')
                return [];
            }

        } catch (e) {
            console.error(e)
            return []
        }
    }


    async getMyExecutionPerscriptionsByProxy(proxyId: string, count: number, offset?: number) {
        try {
            const url = this.serverAddress + this.executionPerscriptionEndpoints.getMyExecutionPerscriptionsByProxy + `?count=${count}`
                + `&proxyId=${proxyId}`;

            if (offset) {
                url + `&offset=${offset}`
            }
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authToken,
                },
            });

            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                return this.adapter.convertReceivedExecutionPerscriptions(rawRes['data']);
            }

        } catch (e) {
            console.error(e)
            return []
        }
    }

    async createExecutionPerscription(perscription: ExecutionPerscription) {
        try {
            const serializedPerscription = JSON.stringify(
                this.adapter.convertExecutionPerscriptionForSendingToNew(perscription));

            const res = await fetch(this.serverAddress + this.executionPerscriptionEndpoints.createExectuionPerscription, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authToken,
                },
                body: serializedPerscription,
            });

            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                // This is the uid of generated perscription
                return rawRes['data'];
            } else {
                console.error('Error creating new execution perscription')
                console.error(await res.text())
            }
        } catch (e) {
            console.error(e)
        }


    }

    async getExecutionPerscriptionLogs(perscriptionId: string, count: number) {
        try {
            const url = this.serverAddress + this.executionPerscriptionEndpoints.getExecutionPerscriptionLogs + `?executionPerscriptionId=${perscriptionId}` + `&count=${count}`
            console.log(url);
            const res = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.authToken,
                    }
                }
            );

            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                return rawRes['data'];
            } else {
                console.log(await res.text())
                return [];
            }
        } catch (e) {
            console.error(e)
        }
    }

    async getUserProfile() {
        try {
            const res = await fetch(this.serverAddress + this.userEndpoints.getMyProfile,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.authToken,
                    },
                });
            if (res.status === 200) {
                const rawRes = await res.json()
                console.log(rawRes)
                return this.adapter.convertReceivedUserProfile(rawRes['data']);
            }
        } catch (e) {
            console.error(e)
            return null;
        }

    }


}

export class DataAdapter {
    constructor() { }

    convertReceivedProxyAccounts(rawData: any[]) {
        const proxyAccounts = rawData.map((rawProxyAccount: any) => {
            return new ProxyAccount(
                rawProxyAccount.id,
                rawProxyAccount.name,
                rawProxyAccount.executionStatus,
                rawProxyAccount.mnemonica,
                rawProxyAccount.creationDate,
                rawProxyAccount.active,
            )
        })

        return proxyAccounts
    }

    // applet uid should be zero, although it is not used
    convertAppletForSending(applet: Applet) {
        const rawApplet = {
            script: applet.script,
            appletVisibility: applet.visibility,
            metadata: JSON.stringify({
                name: applet.name,
                developer: applet.developer,
                url: applet.url,
                logoUrl: applet.logoUrl,
                description: applet.description,
                shortDescription: applet.shortDescription,
                rating: applet.rating,
                updates: applet.updates,
                installNotes: applet.installNotes,
                uninstallNotes: applet.uninstallNotes,
            }),
        }
        return rawApplet
    }

    convertReceivedApplets(rawData: any[]) {
        const applets = rawData.map((rawApplet: any) => {
            let metaData = {
                name: '',
                developer: '',
                url: '',
                logoUrl: '',
                description: '',
                shortDescription: '',
                rating: '',
                updates: '',
                installNotes: '',
                uninstallNotes: '',
            };
            try {
                metaData = JSON.parse(rawApplet.metadata);
            } catch (e) {
                console.warn(e);

            }

            return new Applet(
                rawApplet.id,
                rawApplet.script.scriptText,
                rawApplet.owner,
                rawApplet.visibility,
                rawApplet.appletType,
                metaData.name,
                metaData.developer,
                metaData.url,
                metaData.logoUrl,
                metaData.description,
                metaData.shortDescription,
                metaData.rating,
                metaData.updates,
                metaData.installNotes,
                metaData.uninstallNotes,
            )
        });

        return applets;
    }

    convertReceivedExecutionPerscriptions(rawData: any[]) {
        return rawData.map((rawPerscription: any) => {
            console.log(rawPerscription);
            return new ExecutionPerscription(
                rawPerscription.id,
                rawPerscription.proxyAccount.id,
                rawPerscription.applet.id,
                rawPerscription.cron,
                rawPerscription.metadata,
                rawPerscription.active,
            )
        });
    }

    convertExecutionPerscriptionForSendingToNew(perscription: ExecutionPerscription) {
        return {
            appletId: perscription.appletId,
            proxyAccountId: perscription.proxyAccountId,
            cron: perscription.cron,
            active: perscription.active,
            // NOTE: metadata can't be empty string
            metadata: perscription.metadata || 'string',
        }
    }



}
