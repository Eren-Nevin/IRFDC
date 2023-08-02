import type { RequestEvent, RequestHandler } from './$types';
import { error, json, text } from '@sveltejs/kit';

import fs from 'fs';
import { ResourceRequest, ResourceResponse, getCompaniesName } from '$lib//gather';
import { SERVER_ADDRESS } from '$lib/utils';


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

    const response = new ResourceResponse(req.resource, 10, `${SERVER_ADDRESS}?filename=data.json`, 'data.json')

    return json(response)

}) satisfies RequestHandler;
