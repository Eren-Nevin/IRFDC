<script lang="ts">
	import { ResourceRequest, ResourceResponse } from '$lib/utils';
	import { SERVER_ADDRESS, stopResource, downloadLastUpdate, getLastState, updateResource } from '$lib/utils';
	import { stringify } from 'postcss';

	import logo from '$lib/assets/logo.png';
	import { onMount } from 'svelte';

	class Resource {
		constructor(public name: string, public localName: string, public lastUpdate: string, public progress: string) {}
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



    function formatProgress(progress: string) {
        if (progress.length > 4){
            let shortened = progress.substring(0, 4)
            if (shortened[-1] !== '%'){
                shortened += '%'
            }
            return shortened
        } else {
            return progress
        }
    }

	let appState = '';
    let appStateResource = '';



	const companies = new Resource('companies', 'شرکت ها', 'None', '0%');
	const substance = new Resource('substance', 'مواد اولیه دارویی', 'None', '0%');
	const drug_license = new Resource('drug_license', 'پروانه دارو', 'None', '0%');
	const drug_equipment = new Resource('drug_equipment', 'تجهیزات', 'None', '0%');
	const supplement = new Resource('supplement',  'مواد اولیه مکمل', 'None', '0%');
	const supplement_license = new Resource('supplement_license', 'پروانه مکمل', 'None', '0%');
	const food = new Resource('food', 'مواد اولیه غذایی و آشامیدنی', 'None', '0%');
	const cosmetic = new Resource('cosmetic', 'مواد اولیه آرایشی و بهداشتی', 'None', '0%');
	const special_food = new Resource('special_food', 'مواد اولیه غذای ویژه و شیر خشک', 'None', '0%');
	const herbal = new Resource('herbal', 'مواد اولیه داروهای طبیعی و سنتی', 'None', '0%');
	const essentials = new Resource('essentials', 'ملزومات دارویی', 'None', '0%');
	const cosmetic_license = new Resource('cosmetic_license', 'آرایشی و بهداشتی', 'None', '0%');


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
	<title>Decachem</title>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="w-full flex items-center justify-center bg-indigo-800 p-4">
	<div class="container bg-gray-200 rounded-md m-8 p-4">
		<div class="overflow-x-auto">
			<table class="table text-lg text-black font-semibold">
				<!-- head -->
				<thead>
					<tr>
						<!-- <th class="text-[18px]">زیر سیستم</th> -->
						<th>
							<div class="w-full flex flex-row justify-center">
								<p class="mx-auto text-[18px] text-black">فرمانها</p>
							</div>
						</th>
						<th class="text-[18px] text-black">آخرین آپدیت ذخیره شده</th>
						<th class="text-[18px] text-black">درصد پیشرفت</th>
						<th class="text-[18px] text-right text-black">زیر سیستم</th>
					</tr>
				</thead>
				<tbody>
					<!-- row 1 -->
					{#each resources as resource}
						<tr class={(resource.progress !== '100%' && resource.progress !== '0' && resource.progress !== '0%') ? 'bg-green-500': ''}>
							<!-- <td> -->
							<!-- 	<p class="font-bold">{resource.name}</p> -->
							<!-- </td> -->
							<td>
								<div class="w-full flex justify-center flex-row-reverse gap-2">
									<button
										class="btn btn-info btn-s"
										on:click={async () => {
                                            appStateResource = resource.name
											appState = `در حال گرفتن وضعیت ${resource.localName}`;
											const res = await getLastState(resource.name);
                                            console.log(res.progress)
											if (res.progress) {
												resource.progress = res.progress;
											}
											if (res.fileModificationDate) {
												resource.lastUpdate = res.fileModificationDate;
											} else {
												resource.lastUpdate = 'None';
                                            }
											appState = `وضعیت ${resource.localName} گرفته شد`;
										}}>وضعیت</button
									>
									<button
										class="btn btn-success btn-s"
										on:click={async () => {
                                            appStateResource = resource.name
											appState = `دستور آپدیت ${resource.localName} ارسال شد`;
											const status = await getLastState(resource.name);
											if (status.progress === '0' || status.progress === '100%') {
											const res = await updateResource(resource.name);
											if (res.progress) {
												resource.progress = res.progress;
											}
											if (res.fileModificationDate) {
												resource.lastUpdate = res.fileModificationDate;
											}
                                            }  else {

											appState = `${resource.localName} در حال گرفتن است. ابتدا متوقف کرده و سپس شروع کنید`;
                                            }

										}}>شروع</button
									>
									<button
										class="btn btn-error btn-s"
										on:click={async () => {
                                            appStateResource = resource.name
											appState = `دستور توقف ${resource.localName} ارسال شد`;
											const res = await stopResource(resource.name);
											if (res.progress) {
												resource.progress = res.progress;
											}
											if (res.fileModificationDate) {
												resource.lastUpdate = res.fileModificationDate;
											}
										}}>توقف</button
									>
									<button
										class="btn btn-primary btn-s"
										on:click={async () => {
                                            appStateResource = resource.name
											appState = `دستور دانلود ${resource.localName} صادر شد`;
											const res = await downloadLastUpdate(resource.name);
											if (res.progress) {
												resource.progress = res.progress;
											}
											if (res.fileModificationDate) {
												resource.lastUpdate = res.fileModificationDate;
											}

											if (res.fileUrl) {
												// Update exists
												await downloadStateFileFromServer(res.fileUrl, res.filename);
											} else {
												appState = `آپدیتی برای ${resource.localName} وجود ندارد`;
											}
										}}>دانلود</button
									>
								</div>
							</td>
							<td>{resource.lastUpdate}</td>
							<td> {formatProgress(resource.progress)} </td>
							<td>
								<p class="font-medium text-black text-right">{resource.localName}</p>
                                {#if appStateResource && appStateResource === resource.name}
                                    <p class="p-4 font-medium text-gray-600 text-right">{appState}</p>
                                {/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
