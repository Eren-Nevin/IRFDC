<script lang="ts">
	import { isLoggedIn } from '$lib/auth';
	import { MetamaskHandler } from '$lib/metamask';
	import { SERVER_ADDRESS } from '$lib/utils';
	import { ResourceRequest, ResourceResponse } from './+server';
	import { stringify } from 'postcss';

	type StartState = 'none' | 'metamask' | 'snap';
	type ButtonState = 'disabled' | 'ready' | 'done';

	let appState: StartState = 'none';

	const metamaskHandler = new MetamaskHandler();


    async function updateResource() {
		const rawRes = await fetch(SERVER_ADDRESS, {
			method: 'POST',
			body: JSON.stringify(new ResourceRequest('companies', 'update'))
		});
		const res = await rawRes.json() as ResourceResponse
        console.log(res)
        
    }

    async function getLastState() {
		const rawRes = await fetch(SERVER_ADDRESS, {
			method: 'POST',
			body: JSON.stringify(new ResourceRequest('companies', 'status'))
		});
		const res = await rawRes.json() as ResourceResponse
        console.log(res)
        
    }

	async function downloadLastUpdate() {
		const rawRes = await fetch(SERVER_ADDRESS, {
			method: 'POST',
			body: JSON.stringify(new ResourceRequest('companies', 'get_last'))
		});
		const res = await rawRes.json() as ResourceResponse
        console.log(res)

		if (res.fileUrl) {
			// Update exists
			await downloadStateFileFromServer(res.fileUrl, res.filename);
		} else {
			console.log(`Update Doesnt Exist:${res.progress}`);
		}
	}

	async function openPopUpClickHandler() {
		console.log(`opening popup`);
		let url = `auth`;
		if (await isLoggedIn()) {
			url = `control`;
		}

		const popup = window.open(
			url,
			undefined,
			`height=550, left=1635, top=170, status=no, width=350, titlebar=no, toolbar=no, menubar=no, popup`
		);
		// if (popup) {
		// 	popup.window.addEventListener('load', () => {
		// 		popup.window.addEventListener('unload', async () => {
		// 			await onPopupClosed();
		// 		});
		// 	});
		// }
	}

	const getButtonClass = (buttonName: string, appState: StartState) => {
		let buttonState: ButtonState = 'ready';
		switch (buttonName) {
			case 'metamask':
				switch (appState) {
					case 'none':
						buttonState = 'ready';
						break;
					default:
						buttonState = 'done';
				}
				break;
			case 'snap':
				switch (appState) {
					case 'none':
						buttonState = 'disabled';
						break;
					case 'metamask':
						buttonState = 'ready';
						break;
					case 'snap':
						buttonState = 'done';
						break;
				}
				break;
		}
		console.log(buttonState);
		switch (buttonState) {
			case 'disabled':
				return 'btn-accent';
			case 'done':
				return 'btn-success';
			default:
				return '';
		}
	};

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
				alert('your file has downloaded!'); // or you know, something with better UX...
			})
			.catch(() => alert('oh no!'));
	}
</script>

<svelte:head>
	<title>Xtreamly</title>
	<link
		rel="icon"
		href="https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3001788566-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FssWXZ6ySl0mrYIAVmLjq%252Ficon%252FQPE0NacB3sAo4zgvg2Tz%252FXtreamly.jpg%3Falt%3Dmedia%26token%3Dc6b77943-f21c-40d2-b8d4-867f38a319f3"
	/>
	<link
		rel="shortcut icon"
		href="https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3001788566-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FssWXZ6ySl0mrYIAVmLjq%252Ficon%252FQPE0NacB3sAo4zgvg2Tz%252FXtreamly.jpg%3Falt%3Dmedia%26token%3Dc6b77943-f21c-40d2-b8d4-867f38a319f3"
	/>
</svelte:head>

<div class="w-full h-screen bg-base-100 flex items-center justify-center">
	<div
		class="container mx-auto flex flex-wrap px-5 pt-5 pb-3.5 flex-col
        items-center gap-2 justify-center"
	>
		<button class="btn btn-primary {getButtonClass('snap', appState)}" on:click={async () => {
            await updateResource();
        }}
			>Update</button
		>
		<button class="btn btn-primary {getButtonClass('snap', appState)}" on:click={async () => {
            await getLastState();
        }}
			>Get Last State</button
		>
		<button class="btn btn-primary {getButtonClass('snap', appState)}" on:click={async () => {
            await downloadLastUpdate();
        }}
			>Download Last Update</button
		>
	</div>
</div>
