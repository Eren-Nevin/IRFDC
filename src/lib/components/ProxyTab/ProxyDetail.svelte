<script lang="ts">
	import { getAllApplets } from '$lib/applets';
	import { getAuthToken } from '$lib/auth';
	import { BackendHandler } from '$lib/backend';
	import { MetamaskHandler } from '$lib/metamask';
	import {
		getMyExecutionPerscriptions,
		getMyExecutionPerscriptionsByProxy
	} from '$lib/execution_perscriptions';
	import { Applet, ExecutionPerscription, ExecutionStatus, ProxyAccount } from '$lib/models';
	import { faArrowsRotate, faChevronLeft, faStop } from '@fortawesome/free-solid-svg-icons';

	import { getContext, onMount } from 'svelte';
	import { Icon } from 'svelte-awesome';
	import type { Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	const proxies = getContext<Writable<ProxyAccount[]>>('proxies');
	const allApplets = getContext<Writable<Applet[]>>('allApplets');
	const executions = getContext<Writable<ExecutionPerscription[]>>('executions');

	export let selectedProxyId: string;

	const backendHandler = new BackendHandler(getAuthToken() ?? '');

	$: proxy = $proxies.find((e) => e.uid == selectedProxyId);

	$: proxyExecutions = $executions.filter((e) => e.proxyAccountId == selectedProxyId);

	$: installedAppletIdsOnThisProxy = proxyExecutions.map((pe) => pe.appletId);

	$: installedAppletsOnThisProxy = $allApplets.filter((a) =>
		installedAppletIdsOnThisProxy.includes(a.uid)
	);

	onMount(async () => {
		console.log('ON MOUNT');
		await refreshData();
		console.log(installedAppletsOnThisProxy);
	});

	async function refreshData() {
		const currentAllApplets = await getAllApplets(backendHandler);

		allApplets.set(currentAllApplets);

		const currentExecutionPerscriptions = await getMyExecutionPerscriptions(backendHandler);

		executions.set(currentExecutionPerscriptions);

		// const currentExecutionPerscriptionsForProxy = await getMyExecutionPerscriptionsByProxy(backendHandler, selectedProxyId);
	}

	const getDelegations = (proxy: ProxyAccount) => {};

	const getTokenBalances = (proxy: ProxyAccount) => {};

	const getEthBalance = (proxy: ProxyAccount) => {};

	// let proxyState: ProxyState;
	//
	// $: proxyState = getProxyState(proxy) ?? 'Undefined';

	let showMnemonica = false;

	// TODO: Add button to retreive chain addresses and mnemonica
</script>

{#if selectedProxyId && proxy}
	<div
		transition:fly={{ duration: 200, x: '50vw', opacity: 0.5 }}
		class="w-full flex flex-col items-start px-2"
	>
		<div class="w-full flex flex-row justify-start my-4">
			<button
				class="btn btn-xs text-blue-400 bg-transparent border-transparent hover:bg-transparent hover:border-transparent"
				on:click={() => {
					selectedProxyId = '';
				}}
			>
				<Icon data={faChevronLeft} />
				Back
			</button>
		</div>
		<div class="flex flex-row items-center gap-2">
			{#if proxy.status === ExecutionStatus.RUNNING}
				<Icon data={faArrowsRotate} class="text-blue-600 fa-thin" />
			{:else if proxy.status === ExecutionStatus.STOPPED}
				<Icon data={faStop} class="text-blue-600" />
			{/if}
			<h2>{proxy.status ? 'Stopped' : 'Running'}</h2>
		</div>

		<!-- {#if proxy.appId} -->
		<!-- 	<p class="text-xs font-light"> -->
		<!-- 		Applet: {proxy.appId} -->
		<!-- 	</p> -->
		<!-- {/if} -->
		<div class="flex flex-row gap-2 my-2">
			<button class="btn btn-secondary font-light btn-xs">Stop</button>
			<button class="btn btn-xs font-light bg-red-500 text-gray-100">Remove</button>
		</div>
		<div class="divider my-1" />
		<button
			class="my-2 font-light btn btn-xs btn-secondary"
			on:click={() => {
				console.log('Get Mnemonica');
				showMnemonica = !showMnemonica;
			}}
		>
			{showMnemonica ? 'Hide Menemonica' : 'Show Mnemonica'}
		</button>
		{#if showMnemonica}
			<p class="m-2 p-2 font-light text-xs border border-gray-300 rounded">{proxy.mnemonica}</p>
		{/if}
		<div class="divider my-1" />
		<h2 class="">Balance & Delegations</h2>
		<ul class="font-light list-disc my-2">
			<!-- TODO: Get Balances And Delgations Info -->
			<!-- {#each proxy.delegations as delegation} -->
			<!-- 	<li class="text-xs font-light ml-4"> -->
			<!-- 		{`${delegation.token}: ${delegation.amount}`} -->
			<!-- 	</li> -->
			<!-- {/each} -->
		</ul>
		<button class="btn btn-secondary btn-xs font-light mt-1">Change</button>
		<div class="divider my-1" />
		<h2 class="">Installed Applets</h2>
		<ul class="font-light my-2">
			{#each installedAppletsOnThisProxy as applet}
				<li>
					<h2>- {applet.name}</h2>
				</li>
			{/each}
		</ul>

		<!-- TODO: Query The Applet info -->
		<!-- {#if proxy.appId} -->
		<!-- <button -->
		<!-- 	class="h-6 text-blue-700 text-sm ms-auto font-light normal-case p-0" -->
		<!-- 	onclick="my_modal_3.showModal()">Show Code</button -->
		<!-- > -->
		<!-- 	<dialog id="my_modal_3" class="modal"> -->
		<!-- 		<form method="dialog" class="modal-box"> -->
		<!-- 			<button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button> -->
		<!-- 			<h3 class="font-bold text-lg">Code</h3> -->
		<!-- 			<p -->
		<!-- 				class="border-gray-300 border rounded-md p-2 my-2 text-xs font-light whitespace-break-spaces break-words" -->
		<!-- 			> -->
		<!-- 				{proxy.code} -->
		<!-- 			</p> -->
		<!-- 		</form> -->
		<!-- 	</dialog> -->
		<!-- {:else} -->
		<!-- TODO: Send user to applet screen -->
		<!-- 	<button class="h-6 text-blue-700 text-sm ms-auto font-light normal-case p-0"> -->
		<!-- 		Install -->
		<!-- 	</button> -->
		<!-- {/if} -->
	</div>
{/if}
