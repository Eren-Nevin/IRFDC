import type { RequestEvent, RequestHandler } from './$types';
import { error, json, text } from '@sveltejs/kit';

import { ResourceRequest, ResourceResponse } from '$lib/utils';

import fs from 'fs';
import cp from 'child_process';
import { SERVER_ADDRESS } from '$lib/utils';

// TODO: Chcek if started and don't start 

function execShellCommand(cmd: string) {
    const exec = cp.exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
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
    const req = (await request.json()) as ResourceRequest
    const updateFileMaybe = `./appData/${req.resource}.xlsx`

    const resource_progress_file = `./appData/${req.resource}_progress.out`

    let progressContent = '0'

    try {
        if (fs.existsSync(resource_progress_file)) {
            progressContent = fs.readFileSync(resource_progress_file, 'utf8');
        }
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
            const formattedDate = new Date(mtimeMs).toLocaleString("en-US", { timeZone: "Asia/Tehran" })
            let response = new ResourceResponse(req.resource, progressContent, `${SERVER_ADDRESS}?filename=${req.resource}.xlsx`, `${req.resource}.xlsx`, `${formattedDate}`)
            return json(response)
        }

        else {
            let response = new ResourceResponse(req.resource, progressContent, ``, ``, ``)
            return json(response)

        }
    } else if (req.command == 'status') {
        if (updateExists) {
            const { birthtime, mtime, mtimeMs } = fs.statSync(updateFileMaybe)
            const formattedDate = new Date(mtimeMs).toLocaleString("en-US", { timeZone: "Asia/Tehran" })
            let response = new ResourceResponse(req.resource, progressContent, ``, ``, `${formattedDate}`)

            return json(response)
        } else {
            let response = new ResourceResponse(req.resource, progressContent, ``, ``, ``)
            return json(response)
        }

    } else if (req.command == 'update') {
        // TODO: Remove count
        const command = execShellCommand(`cd backend; python3 app.py ${req.resource} ;`);
        let response = new ResourceResponse(req.resource, '0', ``, ``, ``)
        return json(response)
    } else if (req.command == 'stop') {
        // const command = await execShellCommand(`ps aux | grep 'python app.py ${req.resource}$' | awk '{print $2}'`);
        const command = await execShellCommand(`cd backend; ./kill_resource.sh ${req.resource}`);
        return json({'msg': command})
    }

    return json({ 'status': 'bad request' })


}) satisfies RequestHandler;
