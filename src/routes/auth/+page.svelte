<script lang="ts">
	import { goto } from '$app/navigation';
	import { login, signup, isLoggedIn, getAuthToken, logout, signupAndLogin } from '$lib/auth';

	let email = '';
	let password = '';

	let loggingIn = false;
</script>

<div
	class="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
>
	<h2 class="text-gray-900 text-lg font-medium title-font mb-5">
		{loggingIn ? 'Login' : 'Signup'}
	</h2>
	<div class="relative mb-4">
		<label for="email" class="leading-7 text-sm text-gray-600">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
			bind:value={email}
		/>
	</div>
	<div class="relative mb-4">
		<label for="password" class="leading-7 text-sm text-gray-600">Password</label>
		<input
			type="password"
			id="password"
			name="password"
			class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
			bind:value={password}
		/>
	</div>
    <!-- TODO: Add Error Handling -->
	<button
		class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
		on:click={async () => {
			if (loggingIn) {
				const res = await login(email, password);
                if (res) {
                    goto('/control');
                }
			} else {
				const res = await signupAndLogin(email, password);
                if (res) {
                    goto('/control');
                }
			}
		}}
	>
		{loggingIn ? 'Login' : 'Signup'}</button
	>
	<p class="text-xs text-gray-500 mt-3">
		By signing to Xtreamly, you're accepting our terms of use.
	</p>
	<span
		class="text-blue-600 font-light text-xs"
		on:click={() => {
			loggingIn = !loggingIn;
		}}
	>
		{loggingIn ? 'Signup instead' : 'Login instead'}
	</span>
</div>
