<script lang="ts">
	import { getAuthToken } from '$lib/auth';
	import { BackendHandler } from '$lib/backend';
	import { ExecutionStatus, SupportedChains, type ProxyAccount } from '$lib/models';
	import { faInfo, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
	import { getContext } from 'svelte';
	import { Icon } from 'svelte-awesome';
	import type { Writable } from 'svelte/store';

	import { stopProxy, resumeProxy, getProxies } from '$lib/proxies';

	export let selectedProxyId: string;
	export let proxyId: string;

	const proxies = getContext<Writable<ProxyAccount[]>>('proxies');

	const backendHandler = new BackendHandler(getAuthToken() ?? '');

	$: proxy = $proxies.find((e) => e.uid === proxyId);

	const refreshProxyList = async () => {
		const receivedProxies = await getProxies(backendHandler);
		proxies.set(receivedProxies);
	};
</script>

{#if proxy}
	<div
		class="w-full flex flex-row items-center
            border border-gray-300 rounded-md
            p-6
            h-12
            bg-gray-100
            "
		on:click={() => {
			if (proxy) {
				selectedProxyId = proxy.uid;
			}
		}}
		on:keypress={() => {
			if (proxy) {
				selectedProxyId = proxy.uid;
			}
		}}
	>
		<h1 class="text-sm mr-auto">{`${proxy.name}`}</h1>
		<div class="flex flex-row ml-auto gap-2">
			<!-- <button -->
			<!-- 	class="btn btn-sm btn-circle bg-base-100 -->
			<!--                  border border-gray-300 -->
			<!--                  " -->
			<!-- 	on:click|stopPropagation={async () => { -->
			<!-- 		console.log('HELLO'); -->
			<!-- 		console.log(backendHandler); -->
			<!-- 		const res = await backendHandler.getProxyAccountAddress(proxyId, SupportedChains.BITCOIN); -->
			<!-- 		console.log(res); -->
			<!-- 	}} -->
			<!-- > -->
			<!-- 	<Icon data={faInfo} scale={0} class="text-blue-600 fa-thin" /> -->
			<!-- </button> -->
			<button
				class="btn btn-sm btn-circle bg-base-100
                    border border-gray-300
                    "
				on:click|stopPropagation={async () => {
					if (proxy) {
						if (proxy.status === ExecutionStatus.RUNNING) {
							await stopProxy(backendHandler, proxy.uid);
							await refreshProxyList();
						} else {
							await resumeProxy(backendHandler, proxy.uid);
							await refreshProxyList();
						}
					}
				}}
			>
				<Icon
					data={proxy.status === ExecutionStatus.RUNNING ? faStop : faPlay}
					class="text-blue-600 fa-thin"
				/>
			</button>
		</div>
	</div>
{/if}
