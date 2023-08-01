<script lang="ts">
	import type { Writable } from 'svelte/store';
	import ProxyControlRow from '../ProxyControlRow.svelte';
	import ProxyDetail from '../ProxyTab/ProxyDetail.svelte';

	import { type ProxyAccount, ExecutionStatus } from '$lib/models';
	import { BackendHandler } from '$lib/backend';
	import { getAuthToken } from '$lib/auth';
	import { getContext } from 'svelte';

	import { createProxy, getProxies } from '$lib/proxies';

	const proxies = getContext<Writable<ProxyAccount[]>>('proxies');

	// TODO: Retreive mnemonic by button

	let selectedProxyId = '';

	let beingAddedProxyName = '';

	$: runningProxies = $proxies.filter((pr) => pr.status === ExecutionStatus.RUNNING);
	$: stoppedProxies = $proxies.filter((pr) => pr.status === ExecutionStatus.STOPPED);

	// TODO: Add Error Handling
	const backendHandler = new BackendHandler(getAuthToken() ?? '');

	const refreshProxyList = async () => {
		const receivedProxies = await getProxies(backendHandler);
		proxies.set(receivedProxies);
	};
</script>

<div class="w-full flex flex-col items-start px-4 gap-3">
	{#if selectedProxyId}
		<ProxyDetail bind:selectedProxyId />
	{:else}
		<div class="w-full mt-2" />
		<div class="w-full flex flex-row px-2 justify-end gap-2">
			<button
				class="btn btn-primary btn-sm"
				onclick="event.stopPropagation(); 
                document.getElementById('add_proxy_modal').showModal();">New</button
			>
			<button
				class="btn btn-primary btn-sm"
				on:click={async () => {
					await refreshProxyList();
				}}>Refresh</button
			>
		</div>
		<dialog id="add_proxy_modal" class="modal">
			<form method="dialog" class="modal-box">
				<h3 class="font-bold text-lg">Install</h3>
				<!-- Replace this with dropdown -->
				<div class="py-2 flex flex-col gap-2">
					<input
						type="text"
						placeholder="Enter Proxy Name"
						class="input input-bordered w-full max-w-xs"
						bind:value={beingAddedProxyName}
					/>
				</div>
				<button
					class="btn btn-sm btn-primary"
					on:click={async () => {
						await createProxy(backendHandler, beingAddedProxyName);
						await refreshProxyList();
					}}>Add</button
				>
			</form>

			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
		<h2 class="text-md font-semibold">Running:</h2>
		{#if runningProxies.length !== 0}
			<div class="w-full flex flex-col gap-1">
				{#each runningProxies as proxy}
					<ProxyControlRow proxyId={proxy.uid} bind:selectedProxyId />
				{/each}
			</div>
		{/if}
		<h2 class="text-md font-semibold">Stopped</h2>
		{#if stoppedProxies.length !== 0}
			{#each stoppedProxies as proxy}
				<div class="w-full flex flex-row">
					<ProxyControlRow proxyId={proxy.uid} bind:selectedProxyId />
				</div>
			{/each}
		{/if}
		<div class="w-full my-2" />
	{/if}
</div>
