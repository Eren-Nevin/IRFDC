import { Applet, AppletType, AppletVisibility } from '$lib/models';
import type { BackendHandler } from '$lib/backend';

export async function publishApplet(
    backendHandler: BackendHandler,
    name: string,
    script: string,
    developer: string,
    url: string,
    logoUrl: string,
    description: string,
    shortDescription: string,
    rating: string,
    updates: string,
    installNotes: string,
    uninstallNotes: string,
    visibility?: AppletVisibility
) {

    const newApplet = new Applet(
        '0',
        script,
        '',
        visibility ?? AppletVisibility.PRIVATE,
        AppletType.GENERAL,
        name,
        developer,
        url,
        logoUrl,
        description,
        shortDescription,
        rating,
        updates,
        installNotes,
        uninstallNotes
    );
    const res = await backendHandler.publishNewApplet(newApplet);

    newApplet.uid = res;

    return newApplet;
}

export async function getAllApplets(
    backendHandler: BackendHandler,
    count: number = 100,
) {
    const res = await backendHandler.getAllApplets(count);
    return res;
}

export async function getMyApplets(
    backendHandler: BackendHandler,
    count: number = 100,
) {
    const res = await backendHandler.getMyApplets(count);
    return res;
}
