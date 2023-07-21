<script lang="ts">
	import { library, icon } from '@fortawesome/fontawesome-svg-core';
	import { faArrowLeft, faArrowRight } from '@fortawesome/fontawesome-free-solid';
	export let i;
	const icons = {
		left: faArrowLeft,
		right: faArrowRight
	};
	library.add(faArrowLeft, faArrowRight);
	$: html = icon(icons[i]).html;
</script>

{@html html}
