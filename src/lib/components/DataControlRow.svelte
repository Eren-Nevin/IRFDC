<script lang="ts">
	import type { AuthData } from '$lib/ProxyAccount';

	export let authData: AuthData;
</script>

<div class="collapse collapse-arrow bg-gray-200 m-1">
	<input type="checkbox" />
	<div
		class="collapse-title w-full flex flex-row px-6 py-2 bg-gray-200 rounded-md space-x-2 items-center"
	>
		<h1 class="text-xs mr-auto">{authData.content}</h1>
	</div>
	<div class="collapse-content">
		<p class="text-sm font-light">
			Address: {`${authData.contractAddress.substring(0, 16)}...`}
		</p>
		<div class="divider my-1" />
		<p class="text-sm font-light">Accessed by:</p>
		<ul class="font-light list-disc">
			{#each authData.accessedBy as accessed}
				<li class="text-xs font-light ml-4">{`${accessed.substring(0, 32)}...`}</li>
			{/each}
		</ul>
	</div>
</div>
