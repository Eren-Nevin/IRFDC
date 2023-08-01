<script lang="ts">
	import { AceEditor } from 'svelte-ace';
	import 'brace/mode/json';
	import 'brace/mode/lua';
	import 'brace/theme/chrome';
	import 'brace/theme/ambiance';
	import 'brace/theme/gruvbox';
	import 'brace/theme/solarized_dark';
	import 'brace/theme/github';
    import 'brace/ext/language_tools';
    import 'brace/snippets/lua'
	export let text = '';

    let editorOptions = {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
    }

</script>

<AceEditor
	class="border-green-500 rounded-lg"
	on:selectionChange={(obj) => console.log(obj.detail)}
	on:paste={(obj) => console.log(obj.detail)}
	on:input={(obj) => console.log(obj.detail)}
	on:focus={() => console.log('focus')}
	on:documentChange={(obj) => console.log(`document change : ${obj.detail}`)}
	on:cut={() => console.log('cut')}
	on:cursorChange={() => console.log('cursor change')}
	on:copy={() => console.log('copy')}
	on:init={(editor) => console.log(editor.detail)}
	on:commandKey={(obj) => console.log(obj.detail)}
	on:changeMode={(obj) => console.log(`change mode : ${obj.detail}`)}
	on:blur={() => console.log('blur')}
	width="100%"
	height="640"
	lang="lua"
	theme="gruvbox"
	bind:value={text}
    options={editorOptions}
/>
