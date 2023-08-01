<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import TabSelector from '$lib/components/TabSelector.svelte';
	import AppletTab from '$lib/components/tabs/AppletTab.svelte';
	import ProxyTab from '$lib/components/tabs/ProxyTab.svelte';

	import type { ProxyAccount, Applet, ExecutionPerscription } from '$lib/models';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const proxies = writable<ProxyAccount[]>(data.proxies);
	// NOTE: This is user applets, not all available applets
	const applets = writable<Applet[]>(data.applets);
	const allApplets = writable<Applet[]>(data.allApplets);
	const executions = writable<ExecutionPerscription[]>(data.executionPerscriptions);


	setContext('proxies', proxies);
	setContext('applets', applets);
	setContext('allApplets', allApplets);
	setContext('executions', executions);

	let activeTab = 'Applet-Tab';

	// TODO: Make it part of state
	// let advancedAccessControl = false;
</script>

<TabSelector bind:activeTab />
<div class="w-auto flex flex-col items-center py-2">
	{#if activeTab === 'Applet-Tab'}
		<AppletTab />
	{:else if activeTab === 'Data'}
		<!-- <DataTab {authDatas} {dynamicAccess} /> -->
	{:else}
		<ProxyTab />
	{/if}
</div>
