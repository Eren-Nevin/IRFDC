export const ssr = false;

// NOTE: This is called once on /control page load.

import { getAuthToken, logout } from '$lib/auth';
import { getAllApplets, getMyApplets } from '$lib/applets';

import type { PageLoad } from './$types';
import { BackendHandler } from '$lib/backend';
import { goto } from '$app/navigation';
import { getMyExecutionPerscriptions } from '$lib/execution_perscriptions';

export const load = (async ({ params }) => {
    const backendHandler = new BackendHandler(getAuthToken() ?? '');

    if (backendHandler.authToken === '') {
        goto('/login');
        console.log('Not Authenticated');
        return;
    } else {
        console.log(backendHandler.authToken);
    }

    const currentMyProxyAccounts = await backendHandler.getProxyAccounts(100);

    const currentAllApplets = await getAllApplets(backendHandler);

    const currentMyApplets = await getMyApplets(backendHandler);

    const currentExecutionPerscriptions = await getMyExecutionPerscriptions(backendHandler);

    return {
        applets: currentMyApplets,
        allApplets: currentAllApplets,
        proxies: currentMyProxyAccounts,
        executionPerscriptions: currentExecutionPerscriptions,
    }
}) satisfies PageLoad;

