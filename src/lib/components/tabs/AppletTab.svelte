<script lang="ts">

	import { Applet, AppletVisibility } from '$lib/models';
	import type { Writable } from 'svelte/store';
	import AppletControlRow from '../AppletControlRow.svelte';
	import AppletDetail from '../AppStoreTab/AppletDetail.svelte';
	import { getContext, onMount } from 'svelte';
	import { BackendHandler } from '$lib/backend';
	import { getAuthToken } from '$lib/auth';

	import { publishApplet, getAllApplets, getMyApplets } from '$lib/applets';

	import { getMyExecutionPerscriptions, getPerscriptionLogs } from '$lib/execution_perscriptions';

	const applets = getContext<Writable<Applet[]>>('applets');
	const allApplets = getContext<Writable<Applet[]>>('allApplets');

	let selectedAppId = '';
	let onlyShowMyApplets = false;

	let addAppletDialogName = '';
	let addAppletDialogDeveloper = '';
	let addAppletDialogUrl = '';
	let addAppletDialogLogoUrl = '';
	let addAppletDialogDescription = '';
	let addAppletDialogShortDescription = '';

	const backendHandler = new BackendHandler(getAuthToken() ?? '');

	const refreshAppletList = async () => {
		const receivedAllApplets = await getAllApplets(backendHandler);
		allApplets.set(receivedAllApplets);
		console.log(receivedAllApplets);
		const receivedMyApplets = await getMyApplets(backendHandler);
		applets.set(receivedMyApplets);
	};

	const getAllLogs = async () => {
		const res = await getMyExecutionPerscriptions(backendHandler);
		let allLogs = {};

		for (let pe of res) {
			const logs = await getPerscriptionLogs(backendHandler, pe.uid);
			allLogs[pe.uid] = logs;
		}

		console.log(allLogs);
	};

	let addAppletCode = false;

	let editorOpen = false;

	async function onEditorClosed() {
		console.log('Editor Closed');
		editorOpen = false;
	}

	function openEditor() {
		console.log(`opening popup`);
		let url = `editor`;
		const popup = window.open(
			url,
			'_blank',
			// TODO: Should this be popup or window?
			`popup`
			// `height=550, left=1635, top=170, status=no, width=350, titlebar=no, toolbar=no, menubar=no, popup`
		);
		if (popup) {
			editorOpen = true;
			popup.window.onmessage = async function (e) {
                console.log("EVENT");
                console.log(e);
				if (e.data.from === 'editor') {
					console.log(`Edited`);
					console.log(e.data.code);
					addAppletCode = e.data.code;
				}
			};
			popup.window.addEventListener('load', () => {
				popup.window.addEventListener('unload', async () => {
					await onEditorClosed();
				});
			});
		}
	}
</script>

<div class="w-full flex flex-col items-center px-2">
	{#if selectedAppId}
		<AppletDetail bind:selectedAppId />
	{:else}
		<div class="w-full flex flex-row items-center gap-1">
			<label class="mr-auto label cursor-pointer flex flex-row space-x-2">
				<span class="label-text font-light">{onlyShowMyApplets ? 'My Applets' : 'All Applets'}</span
				>
				<input type="checkbox" class="toggle" bind:checked={onlyShowMyApplets} />
			</label>
			<!-- <button -->
			<!-- 	class="btn btn-primary btn-sm" -->
			<!-- 	on:click={async () => { -->
			<!-- 		// const newApplet = await publishApplet( -->
			<!-- 		// 	backendHandler, -->
			<!-- 		// 	'Mid Applet', -->
			<!-- 		// 	"Log('Hello', 'There')", -->
			<!-- 		// 	'Some Developer', -->
			<!-- 		// 	'https://google.com', -->
			<!-- 		// 	'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/EmacsIcon.svg/1024px-EmacsIcon.svg.png', -->
			<!-- 		// 	'desc', -->
			<!-- 		// 	'short_desc', -->
			<!-- 		// 	'4.3', -->
			<!-- 		// 	'no_updates', -->
			<!-- 		// 	'install_notes_here', -->
			<!-- 		// 	'uninstall_notes_here', -->
			<!-- 		// 	AppletVisibility.PRIVATE -->
			<!-- 		// ); -->
			<!---->
			<!-- 		openEditor(); -->
			<!---->
			<!-- 		// await refreshAppletList(); -->
			<!-- 	}}>Add</button -->
			<!-- > -->

			<button
				class="btn btn-primary btn-sm"
				onclick="event.stopPropagation(); 
                document.getElementById('add_applet_modal').showModal();">Add</button
			>
			<dialog id="add_applet_modal" class="modal">
				{#if editorOpen}
					<div class="w-full flex flex-col items-center px-2">
						<h1 class="mx-auto">Close the editor to continue</h1>
					</div>
				{:else}
					<form method="dialog" class="modal-box">
						<h3 class="font-bold text-lg">Install</h3>
						<!-- Replace this with dropdown -->
						<div class="py-2 flex flex-col gap-2">
							<input
								type="text"
								placeholder="Name"
								class="input input-bordered w-full max-w-xs"
								bind:value={addAppletDialogName}
							/>
							<input
								type="text"
								placeholder="Developer"
								class="input input-bordered w-full max-w-xs"
								bind:value={addAppletDialogDeveloper}
							/>
							<input
								type="text"
								placeholder="Url"
								class="input input-bordered w-full max-w-xs"
								bind:value={addAppletDialogUrl}
							/>
							<input
								type="text"
								placeholder="Logo Url"
								class="input input-bordered w-full max-w-xs"
								bind:value={addAppletDialogLogoUrl}
							/>
							<input
								type="text"
								placeholder="Description"
								class="input input-bordered w-full max-w-xs"
								bind:value={addAppletDialogDescription}
							/>
							<input
								type="text"
								placeholder="Short Descriptio"
								class="input input-bordered w-full max-w-xs"
								bind:value={addAppletDialogShortDescription}
							/>
							<button
								class="btn btn-sm btn-primary"
								on:click={() => {
									openEditor();
								}}>Code</button
							>
						</div>
						<button
							class="btn btn-sm btn-primary"
							on:click={async () => {
								console.log(addAppletDialogName);
								console.log(addAppletCode);
								if (!addAppletDialogName || !addAppletCode) {
									// alert('Name cannot be empty');
									return;
								}
								const newApplet = await publishApplet(
									backendHandler,
									addAppletDialogName,
									addAppletCode,
									addAppletDialogDeveloper,
									addAppletDialogUrl,
									addAppletDialogLogoUrl,
									addAppletDialogDescription,
									addAppletDialogShortDescription,
									'4.3',
									'No Updates',
									'',
									'',
									AppletVisibility.PRIVATE
								);
							}}>Install</button
						>
					</form>
				{/if}

				<form method="dialog" class="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
			<button
				class="btn btn-primary btn-sm"
				on:click={async () => {
					await refreshAppletList();
				}}>Refresh</button
			>
			<button
				class="btn btn-primary btn-sm"
				on:click={async () => {
					await getAllLogs();
				}}>EP</button
			>
		</div>
		<div class="w-full flex flex-col">
			{#if onlyShowMyApplets}
				{#each $applets as applet}
					<AppletControlRow app={applet} bind:selectedAppId />
				{/each}
			{:else}
				{#each $allApplets as applet}
					<AppletControlRow app={applet} bind:selectedAppId />
				{/each}
			{/if}
		</div>
	{/if}
</div>
