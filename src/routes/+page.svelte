<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	onMount(() => {
		import('leaflet').then((L) => {
      const i = {
        "lat": 43.60174892492184,
        "lng": -116.20350837707521
    }
			const map = L.map('map').setView(i, 13);
      // map.on('move', () => {
      // console.log('map bounds', map.getBounds())

      // })
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);
		});
	});
</script>

<div id="map" />

<style>
	#map {
		height: 100vh;
	}
</style>
