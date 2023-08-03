import type { RequestEvent, RequestHandler } from './$types';
import { error, json, text } from '@sveltejs/kit';

import fs from 'fs';
import cp from 'child_process';
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
        public file_creation_date: string,
    ) { }
}

function execShellCommand(cmd) {
 const exec = cp.exec;
 return new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
   if (error) {
    console.warn(error);
   }
   resolve(stdout? stdout : stderr);
  });
 });
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
    const updateFileMaybe = `./appData/${req.resource}.csv`

    const resource_progress_file = `./appData/${req.resource}_progress.out`

    let progressContent = '0'

    try {
        progressContent = fs.readFileSync(resource_progress_file, 'utf8');

    } catch (e) {
        console.log(e)
    }

    let updateExists = false;

    if (fs.existsSync(updateFileMaybe)) {
        updateExists = true;
    }


    if (req.command == 'get_last') {

        if (updateExists) {
            const { birthtime, mtime, mtimeMs } = fs.statSync(updateFileMaybe)
            const formattedDate = new Date(mtimeMs).toLocaleDateString("en-US", {timeZone: "Asia/Tehran"})
            let response = new ResourceResponse(req.resource, progressContent, `${SERVER_ADDRESS}?filename=${req.resource}.csv`, `${req.resource}.csv`, `${formattedDate}`)
            return json(response)
        }

        else {
            let response = new ResourceResponse(req.resource, progressContent, ``, ``, ``)
            return json(response)

        }
    } else if (req.command == 'status') {
        if (updateExists) {
            const { birthtime, mtime, mtimeMs } = fs.statSync(updateFileMaybe)
            const formattedDate = new Date(mtimeMs).toLocaleDateString("en-US", {timeZone: "Asia/Tehran"})
            let response = new ResourceResponse(req.resource, progressContent, ``, ``, `${formattedDate}`)

            return json(response)
        } else {
            let response = new ResourceResponse(req.resource, progressContent, ``, ``, ``)
            return json(response)
        }

    } else if (req.command = 'update') {
        const command = execShellCommand(`cd backend; python3 app.py companies 1000;`);
        let response = new ResourceResponse(req.resource, '0', ``, ``, ``)
        return json(response)
    }

    return json({ 'status': 'bad request' })


}) satisfies RequestHandler;
