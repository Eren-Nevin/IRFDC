<script lang="ts">
	import { SERVER_ADDRESS, downloadLastUpdate, getLastState, updateResource } from '$lib/utils';
	import { ResourceRequest, ResourceResponse } from '$lib/utils';
	import { stringify } from 'postcss';

	import logo from '$lib/assets/logo.png';
	import { onMount } from 'svelte';

	class Resource {
		constructor(public name: string, public lastUpdate: string, public progress: string) {}
	}

	// TODO: Does it have size limit?
	async function downloadStateFileFromServer(fileurl: string, filename: string) {
		fetch(`${fileurl}`)
			.then((resp) => resp.blob())
			.then((blob) => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				// the filename you want
				a.download = `${filename}`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.catch(() => alert('oh no!'));
	}

	let appState = '';
	const companies = new Resource('companies', 'None', '0%');
	const substance = new Resource('substance', 'None', '0%');
	const drug_license = new Resource('drug_license', 'None', '0%');
	const drug_equipment = new Resource('drug_equipment', 'None', '0%');
	const supplement = new Resource('supplement', 'None', '0%');
	const supplement_license = new Resource('supplement_license', 'None', '0%');
	const food = new Resource('food', 'None', '0%');
	const cosmetic = new Resource('cosmetic', 'None', '0%');
	const special_food = new Resource('special_food', 'None', '0%');
	const herbal = new Resource('herbal', 'None', '0%');
	const essentials = new Resource('essentials', 'None', '0%');
	const cosmetic_license = new Resource('cosmetic_license', 'None', '0%');


// products_api_endpoints = {
//     'substance': '/IRCApi/GetRegisteredSubstanceIRC',
//     'drug_license': '/IRCApi/GetDrugLicenseItemIRC',
//     'drug_equipment': '/IRCApi/GetDrugEquipmentLicenseItemIRC',
//     'supplement': '/IRCApi/GetSupplementRegisteredIRC',
//     'supplement_license': '/IRCApi/GetSupplementLicenseItemIRC',
//     'food': '/IRCApi/GetFoodRegisteredIRC',
//     'cosmetic': '/IRCApi/GetCosmeticRegisteredIRC',
//     'special_food': '/IRCApi/GetParticulareFoodRegisteredIRC',
//     'herbal': '/api/IRCApi/GetTraditionalHerbaceousDrugRegisteredIRC',
//     'essentials': '/IRCApi/GetEssentialsRegisteredIRC',
//     'cosmetic_license': '/IRCApi/GetCosmeticLicenseItemIRC',
// }
	const resources = [
        companies, 
        substance,
        drug_license,
        drug_equipment,
        supplement,
        supplement_license,
        food,
        cosmetic,
        special_food,
        herbal,
        essentials,
        cosmetic_license,
    ];

	async function startupRefresh() {
        for (let i = 0; i < resources.length; i++) {
			const res = await getLastState(resources[i].name);
			if (res.progress) {
                console.log(res.progress);
				resources[i].progress = res.progress;
			}
			if (res.fileModificationDate) {
				resources[i].lastUpdate = res.fileModificationDate;
			}
        }
	}

	onMount(async () => {
		await startupRefresh();
	});
</script>

<svelte:head>
	<title>Xtreamly</title>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="w-full flex items-center justify-center bg-indigo-800 p-4">
	<div class="container bg-gray-200 rounded-md m-8 p-4">
		<div class="overflow-x-auto">
			<table class="table">
				<!-- head -->
				<thead>
					<tr>
						<th>Resource</th>
						<th>Last Update</th>
						<th>Progress</th>
						<th>
							<div class="w-full flex flex-row justify-center">
								<p class="mx-auto">Actions</p>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<!-- row 1 -->
					{#each resources as resource}
						<tr>
							<td>
								<p class="font-bold">{resource.name}</p>
							</td>
							<td>{resource.lastUpdate}</td>
							<td> {resource.progress} </td>
							<td>
								<div class="w-full flex flex-row justify-center gap-2">
									<button
										class="btn btn-primary btn-s"
										on:click={async () => {
											appState = `Getting ${resource.name} status`;
											const res = await getLastState(resource.name);
											if (res.progress) {
												resource.progress = res.progress;
											}
											if (res.fileModificationDate) {
												resource.lastUpdate = res.fileModificationDate;
											}
											appState = `Got ${resource.name} state`;
										}}>Status</button
									>
									<button
										class="btn btn-primary btn-s"
										on:click={async () => {
											appState = `${resource.name} update command issued`;
											const res = await updateResource(resource.name);
											if (res.progress) {
												resource.progress = res.progress;
											}
											if (res.fileModificationDate) {
												resource.lastUpdate = res.fileModificationDate;
											}
										}}>Start</button
									>
									<button
										class="btn btn-primary btn-s"
										on:click={async () => {
											appState = `${resource.name} download last update command issued`;
											const res = await downloadLastUpdate(resource.name);
											if (res.progress) {
												resource.progress = res.progress;
											}
											if (res.fileModificationDate) {
												resource.lastUpdate = res.fileModificationDate;
											}

											if (res.fileUrl) {
												// Update exists
												appState = `Downloading ${resource.name} last update`;
												await downloadStateFileFromServer(res.fileUrl, res.filename);
												appState = `${resource.name} downloaded`;
											} else {
												appState = `Update Doesnt Exist`;
											}
										}}>Download</button
									>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			{#if appState}
				<p class="p-4 text-md text-gray-600">{appState}</p>
			{/if}
		</div>
	</div>
</div>
