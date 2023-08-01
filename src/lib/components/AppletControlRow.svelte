<script lang="ts">
	import { getAuthToken } from '$lib/auth';
	import { BackendHandler } from '$lib/backend';
	import { installApplet } from '$lib/execution_perscriptions';
	import type { Applet, ProxyAccount } from '$lib/models';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	export let app: Applet;

	export let selectedAppId: string;

	const proxies = getContext<Writable<ProxyAccount[]>>('proxies');

	let inputCronString = '';
	let selectedProxyIdInInstallModal = '';
	const backendHandler = new BackendHandler(getAuthToken() ?? '');
</script>

<!-- Fix Row Layout -->

<div
	class="w-full h-24 flex flex-row mx-2 px-2 items-center rounded-md opacity-75 space-x-2"
	on:click={() => {
		selectedAppId = app.uid;
	}}
	on:keypress={() => {
		selectedAppId = app.uid;
	}}
>
	<div class="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0">
		<img class="w-16 h-16" src={app.logoUrl} alt="App Logo" />
	</div>
	<div class="w-full flex flex-col">
		<div class="w-full flex flex-row items-center">
			<span class="text-md text-black">{app.name}</span>
			<div class="h-20 flex flex-auto flex-col my-2 justify-center mr-2">
				<p class="text-xs text-gray-500">{app.shortDescription.slice(0, 12)}</p>
				<div class="flex flex-row space-x-2 items-center mt-1">
					<div class="rating rating-sm">
						<input type="radio" name="rating-1" class="mask mask-star" />
						<input type="radio" name="rating-1" class="mask mask-star" />
						<input type="radio" name="rating-1" class="mask mask-star" />
						<input type="radio" name="rating-1" class="mask mask-star" />
						<input type="radio" name="rating-1" class="mask mask-star" checked />
					</div>
					<p class="text-xs text-gray-500">{app.rating}</p>
				</div>
			</div>
			<button
				class="btn btn-xs w-14 btn-primary rounded-2xl z-10"
				onclick="event.stopPropagation(); 
                document.getElementById('install_modal').showModal();">Get</button
			>
			<dialog id="install_modal" class="modal">
				<form method="dialog" class="modal-box">
					<h3 class="font-bold text-lg">Install</h3>
					<!-- Replace this with dropdown -->
					<div class="py-2 flex flex-col gap-2">
						<select
							class="select select-secondary w-full max-w-xs"
							on:change|preventDefault={(e) => {
								selectedProxyIdInInstallModal = e.target.value;
							}}
						>
							<option disabled selected>Pick proxy account</option>
							{#each $proxies as proxy}
								<option value={proxy.uid}>{proxy.name}</option>
							{/each}
						</select>
						<input
							type="text"
							placeholder="Insert cron string"
							class="input input-bordered w-full max-w-xs"
							bind:value={inputCronString}
						/>
					</div>
					<button
						class="btn btn-sm btn-primary"
						on:click={async () => {
							await installApplet(
								backendHandler,
								app.uid,
								selectedProxyIdInInstallModal,
								inputCronString
							);
						}}>Install</button
					>
				</form>

				<form method="dialog" class="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>

		<div class="h-[1px] w-full bg-gray-300" />
	</div>
</div>
