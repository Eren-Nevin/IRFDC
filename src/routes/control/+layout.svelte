<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/metamask_logo.png';
	import { logout } from '$lib/auth';
	import Icon from 'svelte-awesome';
	import ellipsisV from 'svelte-awesome/icons/ellipsisV';

</script>

<svelte:head>
	<title>Xtreamly Control Panel</title>
</svelte:head>
<section class="w-full bg-gray-50">
	<div class="flex flex-col">
		<!-- <div class="flex flex-row items-center h-16 bg-gray-200 py-4"> -->
		<!-- 	<img src={logo} class="h-8 w-8 ml-4 mr-16" /> -->
		<!-- 	<button class="btn btn-outline rounded-full btn-sm border-gray-400 text-gray-600 text-[12px]"> -->
		<!-- 		Mainnet -->
		<!-- 		<svg -->
		<!-- 			xmlns="http://www.w3.org/2000/svg" -->
		<!-- 			viewBox="0 0 20 20" -->
		<!-- 			fill="currentColor" -->
		<!-- 			class="h-5 w-5" -->
		<!-- 		> -->
		<!-- 			<path -->
		<!-- 				fill-rule="evenodd" -->
		<!-- 				d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" -->
		<!-- 				clip-rule="evenodd" -->
		<!-- 			/> -->
		<!-- 		</svg> -->
		<!-- 	</button> -->
		<!-- 	<div class="mr-4 ml-8"> -->
		<!-- 		<div -->
		<!-- 			class="flex justify-center items-center border-2 border-indigo-300" -->
		<!-- 			style="height: 40px; width: 40px; border-radius: 20px;" -->
		<!-- 		> -->
		<!-- 			<div class="identicon" style="height: 32px; width: 32px; border-radius: 16px;"> -->
		<!-- 				<div -->
		<!-- 					style="border-radius: 50px; overflow: hidden; padding: 0px; margin: 0px; width: 32px; height: 32px; display: inline-block; background: rgb(3, 94, 89);" -->
		<!-- 				> -->
		<!-- 					<svg x="0" y="0" width="32" height="32" -->
		<!-- 						><rect -->
		<!-- 							x="0" -->
		<!-- 							y="0" -->
		<!-- 							width="32" -->
		<!-- 							height="32" -->
		<!-- 							transform="translate(-10.18454272423589 1.5967854506764405) rotate(206.9 16 16)" -->
		<!-- 							fill="#18C6F2" -->
		<!-- 						/><rect -->
		<!-- 							x="0" -->
		<!-- 							y="0" -->
		<!-- 							width="32" -->
		<!-- 							height="32" -->
		<!-- 							transform="translate(17.302416384396725 -9.068722382062873) rotate(362.9 16 16)" -->
		<!-- 							fill="#FB188D" -->
		<!-- 						/><rect -->
		<!-- 							x="0" -->
		<!-- 							y="0" -->
		<!-- 							width="32" -->
		<!-- 							height="32" -->
		<!-- 							transform="translate(-29.33923501668989 0.6590687530638784) rotate(335.4 16 16)" -->
		<!-- 							fill="#238CE1" -->
		<!-- 						/></svg -->
		<!-- 					> -->
		<!-- 				</div> -->
		<!-- 			</div> -->
		<!-- 		</div> -->
		<!-- 	</div> -->
		<!-- </div> -->

		<div class="w-full flex flex-row h-16 bg-gray-50 items-center px-4">
			<div class="avatar">
				<div class="w-1 rounded-full ring ring-gray-300 mr-2">
					<div class="w-1 h-1 bg-green-400" />
				</div>
			</div>
			<p class="text-[10px] font-semibold text-gray-600 mr-12">Connected</p>
			<div class="flex flex-col items-center">
				<p class="font-bold text-[12px]">Account 8</p>
				<p class="font-bold text-[10px] text-gray-500">0x667...038D</p>
			</div>
            <!-- TODO: Add Menu For logout or sth similar -->
			<button
				class="btn btn-xs ml-auto"
				on:click={() => {
					logout();
					goto('../auth');
				}}
			>
                Logout
				<!-- <Icon data={ellipsisV} class="ml-auto" /> -->
			</button>
		</div>
		<div class="divider py-0 my-0 h-1" />
		<slot />
	</div>
</section>
