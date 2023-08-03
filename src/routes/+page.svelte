<script lang="ts">
	import { SERVER_ADDRESS, downloadLastUpdate, getLastState, updateResource } from '$lib/utils';
	import { ResourceRequest, ResourceResponse } from '$lib/utils';
	import { stringify } from 'postcss';

	import logo from '$lib/assets/logo.png';

	let appState = '';

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

	class Resource {
		constructor(public name: string, public lastUpdate: string, public progress: string) {}
	}

	const companies = new Resource('companies', 'None', '0%');
	const substance = new Resource('substance', 'None', '0%');

	const resources = [companies, substance];
</script>

<svelte:head>
	<title>Xtreamly</title>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="w-full h-screen flex items-center justify-center bg-indigo-600">
	<div class="container bg-gray-200 rounded-md m-8 p-4">
		<!-- > -->
		<!-- 	<button -->
		<!-- 		class="btn btn-primary" -->
		<!-- 		on:click={async () => { -->
		<!-- 			await updateResource(); -->
		<!-- 		}}>Update</button -->
		<!-- 	> -->
		<!-- 	<button -->
		<!-- 		class="btn btn-primary" -->
		<!-- 		on:click={async () => { -->
		<!-- 			await getLastState(); -->
		<!-- 		}}>Get Last State</button -->
		<!-- 	> -->
		<!-- 	<button -->
		<!-- 		class="btn btn-primary" -->
		<!-- 		on:click={async () => { -->
		<!-- 			await downloadLastUpdate(); -->
		<!-- 		}}>Download Last Update</button -->
		<!-- 	> -->
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
												appState = `${resource.name} Downloaded`;
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

				{#if appState}
					<tfoot>
						<tr>
							<p>{appState}</p>
						</tr>
					</tfoot>
				{/if}
			</table>
		</div>
	</div>
</div>
