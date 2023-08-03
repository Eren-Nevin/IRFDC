import { ethers } from 'ethers';

export class ResourceRequest {
    constructor(
        public resource: string,
        public command: 'get_last' | 'update' | 'status'
    ) { }
}

export class ResourceResponse {
    constructor(
        public resource: string,
        public progress: string,
        public fileUrl: string,
        public filename: string,
        public fileModificationDate: string,
    ) { }
}

export const SERVER_ADDRESS = 'http://irfdc.adinal.co:3001'
// export const SERVER_ADDRESS = 'https://irfdc.adinal.co:3001'

export async function updateResource(resource: string) {
    const rawRes = await fetch(SERVER_ADDRESS, {
        method: 'POST',
        body: JSON.stringify(new ResourceRequest(resource, 'update'))
    });
    const res = (await rawRes.json()) as ResourceResponse;
    console.log(res);
    return res
}

export async function getLastState(resource: string) {
    const rawRes = await fetch(SERVER_ADDRESS, {
        method: 'POST',
        body: JSON.stringify(new ResourceRequest(resource, 'status'))
    });
    const res = (await rawRes.json()) as ResourceResponse;
    console.log(res);
    return res;
}

export async function downloadLastUpdate(resource: string) {
    const rawRes = await fetch(SERVER_ADDRESS, {
        method: 'POST',
        body: JSON.stringify(new ResourceRequest(resource, 'get_last'))
    });
    const res = (await rawRes.json()) as ResourceResponse;
    console.log(res);
    return res

}
