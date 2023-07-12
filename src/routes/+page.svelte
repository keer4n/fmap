<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import { getGeoJson, getStockingRecords } from '$lib/api/ID';
	onMount(() => {
		import('leaflet').then((L) => {
			const i = {
				lat: 43.60174892492184,
				lng: -116.20350837707521
			};
			const map = L.map('map').setView(i, 13);
			// map.on('move', () => {
			// console.log('map bounds', map.getBounds())

			// })
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);
			// L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
			// 	maxZoom: 20,
			// 	subdomains: ['mt0']
			// }).addTo(map);
			const myLayer = L.geoJSON(undefined, {
				onEachFeature: (feature, layer) => {
					layer.bindPopup(feature.properties.NAME + ' ' + feature.properties.stocked);
				}
			}).addTo(map);
			const records = getStockingRecords().then((records) => {
				console.log('records', records);
				records.rows?.forEach((row) => {
					const waterId = +row.id;
					getGeoJson(waterId).then((gj) => {
						gj.features = gj.features?.map((f) => ({
							...f,
							properties: { ...f.properties, stocked: row.stocked }
						}));
						myLayer.addData(gj as any);
					});
				});
			});
		});
	});
</script>

<div id="map" />

<style>
	#map {
		height: 100vh;
	}
</style>
