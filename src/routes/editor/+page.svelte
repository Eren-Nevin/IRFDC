<script lang="ts">
	import CodeEditor from '$lib/components/Editor/CodeEditor.svelte';

	const SERVER_ADDRESS = 'https://test.xtreamly.io:6001';
	// const SERVER_ADDRESS = 'http://localhost:3001';

	let code = '';
</script>

<div class="w-full flex flex-col items-center justify-center">
	<div class="w-9/12 border border-gray-400 rounded-xl p-9">
		<CodeEditor bind:text={code} />
		<div class="flex flex-row justify-end my-2 gap-2">
			<button
				class="btn btn-primary btn-sm"
				on:click={() => {
					code = '';
					window.postMessage({ from: 'editor', code: code }, `${SERVER_ADDRESS}/control`);
					window.close();
				}}
			>
				Cancel
			</button>
			<button
				class="btn btn-primary btn-sm"
				on:click={() => {
					console.log(code);
					window.postMessage({ from: 'editor', code: code }, `${SERVER_ADDRESS}/control`);
					window.close();
				}}
			>
				Save
			</button>
		</div>
	</div>
</div>
