import type { RequestEvent, RequestHandler } from './$types';
import { error, json, text } from '@sveltejs/kit';

import fs from 'fs';

// urls: companies: /gather/companies
// products: /gather/products
export const POST = (async ({ url, request }) => {
    console.log(url)
    // let save = url.searchParams.get('save');

    return json("");
    // if (save) {
    //     let body = await request.text()
    //     fs.writeFileSync('./appData/data.json', body);
    //     console.log(body);
    //     return text('Saved');
    // }
    // else {
    //     let body = fs.readFileSync('./appData/data.json', 'utf8');
    //     console.log('load');
    //     return json(body);
    // }

}) satisfies RequestHandler;
