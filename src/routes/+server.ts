import type { RequestEvent, RequestHandler } from './$types';
import { error, json, text } from '@sveltejs/kit';

import fs from 'fs';
import { SERVER_ADDRESS } from '$lib/utils';

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
    ) { }
}

export const GET = (async ({ url }) => {
    console.log(`URL: ${url}`)
    const filename = url.searchParams.get('filename');
    console.log(filename);

    const fileStream = fs.createReadStream(`./appData/${filename}`)
    return new Response(fileStream, {
        status: 200,
        headers: {
            "Content-type": "application/json",
            "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
        },

    })
}) satisfies RequestHandler;

// urls: companies: /gather/companies
// products: /gather/products
export const POST = (async ({ url, request }) => {
    console.log(url)
    const req = (await request.json()) as ResourceRequest

    const resource_progress_file = `./appData/${req.resource}_progress`

    if (req.command == 'get_last') {

        let progressContent = '0'

        try {
        progressContent = fs.readFileSync(resource_progress_file, 'utf8');

        } catch (e) {
            console.log(e)
        }

        let updateExists = false;

        if (fs.existsSync(`./appData/${req.resource}.csv`)) {
            updateExists = true;
        }


        let response = new ResourceResponse(req.resource, progressContent, `${SERVER_ADDRESS}?filename=${req.resource}.csv`, `${req.resource}.csv`)

        if (!updateExists) {
            response = new ResourceResponse(req.resource, progressContent, ``, ``)

        }
        return json(response)
    }

    return json({ 'status': 'bad request' })


}) satisfies RequestHandler;
