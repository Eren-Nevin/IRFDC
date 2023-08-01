<script lang="ts">
    export let activeTab: string
</script>

<div class="w-full tabs">
	<a
		class="tab w-1/2 tab-bordered {activeTab === 'Proxies-Tab' ? 'tab-active' : ''}"
		on:click={() => {
			activeTab = 'Proxies-Tab';
		}}>Proxies</a
	>
	<a
		class="tab w-1/2 tab-bordered {activeTab === 'Applet-Tab' ? 'tab-active' : ''}"
		on:click={() => {
			activeTab = 'Applet-Tab';
		}}>Applets</a
	>
</div>
