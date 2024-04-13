<script lang="ts">
	import type { Geometry } from 'geojson';
	import type { GeoJSON, Map as LMap, LayerGroup } from 'leaflet';
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import { getGeoJson, getStockingRecords, type RowsEntity } from '$lib/api/ID';
	import Icon from './Icon.svelte';
	import './styles.css';

	const DEFAULT_LOC = {
		lat: 43.60174892492184,
		lng: -116.20350837707521
	};
	const DEFAULT_ZM = 13;
	let filteredRecords: RowsEntity[] = [];
	let faLayer: GeoJSON<any, Geometry>;
	let map: LMap;
	const locObjectLayerMap = new Map();
	let mapLoaded = false;

	onMount(() => {
		import('leaflet').then(async (L) => {
			map = L.map('map').setView(DEFAULT_LOC, DEFAULT_ZM);
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);

			/**
			 * fishing area layer
			 */
			faLayer = L.geoJSON(undefined, {
				onEachFeature: (feature, layer) => {
					layer.bindPopup(
						feature.properties.NAME +
							' ' +
							feature.properties.stocked.date +
							' ' +
							feature.properties.stocked.species +
							' ' +
							feature.properties.stocked.length
					);
				}
			}).addTo(map);
			console.debug('fishing area layer', faLayer);

			const records = await getStockingRecords();
			console.debug('records', records);

			if (!records.rows || !records.rows?.length) {
				throw Error('No stocking records found.');
			}

			// only select latest stocking report for repeating waters
			filteredRecords = records.rows.reduce<RowsEntity[]>((acc, i) => {
				if (!acc.find((r) => i.id == r.id)) {
					acc.push(i);
				}
				return acc;
			}, []);
		});
	});

	async function addFa(
		stockingRecord: RowsEntity,
		map: LMap,
		faLayer: GeoJSON<any, Geometry>,
		locObjectLayerMap: Map<any, any>
	) {
		if (!locObjectLayerMap.get(idx)) {
			const locData = await getGeoJson(+stockingRecord.id);
			if (!locData) return;
			locData.features = locData.features?.map((f) => ({
				...f,
				properties: {
					...f.properties,
					stocked: {
						date: stockingRecord.stocked,
						species: stockingRecord.spp,
						length: stockingRecord.len,
						quantity: stockingRecord.n
					},
					id: stockingRecord.id
				}
			}));
			faLayer.addData(locData as any);
		}

		const locObjectLayer = faLayer._layers[Object.keys(faLayer._layers)[idx]];
		locObjectLayerMap.set(idx, locObjectLayer);

		return setViewToLoc(map, faLayer, locObjectLayerMap);
	}

	function setViewToLoc(
		map: LMap,
		faLayer: GeoJSON<any, Geometry>,
		locObjectLayerMap: Map<any, any>
	) {
		let i = 0;
		faLayer.eachLayer((layer) => {
			//hide all
			i++;
			layer.setStyle({ weight: 0 });
		});
		console.debug('number of loc objects in fa layer', i);
		// unhide the relevant layer
		const layer = locObjectLayerMap.get(idx);
		layer.setStyle({ weight: 4 });
		layer.openPopup();
		map.setView(layer.getCenter(), DEFAULT_ZM);
		console.debug('loc object layer', layer);
		return {
			fishery: layer.feature.properties.NAME,
			...layer.feature.properties.stocked
		};
	}

	$: selectedStockData = {
		fishery: 'Test Boise River',
		date: '2023/07/12',
		quantity: 90,
		species: 'Trout',
		length: 'Greater than 6 inches'
	};
	$: idx = 0;
	$: {
		idx;
		filteredRecords.length &&
			addFa(filteredRecords[idx], map, faLayer, locObjectLayerMap).then((r) => {
				selectedStockData = r;
			});
			mapLoaded = true;
	}

	// $: console.log('selectedlayer', selectedLayer);

	$: leftArrowDisabled = idx == 0;
	$: rightArrowDisabled = idx == filteredRecords?.length;
</script>

<main>
	<div id="map" class:hidden={!mapLoaded} />
	<div id="controls" class:hidden={!mapLoaded}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<button
			class="i"
			on:click={(e) => {
				if (idx-- >= 0) {
					idx = idx--;
				}
			}}
			class:disabled={leftArrowDisabled}
			disabled={leftArrowDisabled}
		>
			<Icon i="left" />
		</button>
		<div class="content">
			<h2>{selectedStockData.fishery}</h2>
			<div class="info">
				<div class="info-line">
					<pre>Stocked:</pre>
					<pre>{selectedStockData.date}</pre>
				</div>

				<div class="info-line">
					<pre>Quantity:</pre>
					<pre>{selectedStockData.quantity}</pre>
				</div>
				<div class="info-line">
					<pre>Species:</pre>
					<pre>{selectedStockData.species}</pre>
				</div>

				<div class="info-line">
					<pre>Size:</pre>
					<pre>{selectedStockData.length}</pre>
				</div>
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<button
			class="i"
			on:click={(e) => {
				if (idx++ <= filteredRecords?.length) {
					idx = idx++;
				}
			}}
			class:disabled={rightArrowDisabled}
			disabled={rightArrowDisabled}
		>
			<Icon i="right" />
		</button>
	</div>
	<div class:hidden={mapLoaded}> Splash Screen </div>
</main>

<style>
	:global(.hidden) {
		display: none !important;
	}

	.disabled {
		/* opacity: 0.5; */
	}

	button {
		border: none;
	}
	main {
		position: relative;
		top: 0;
	}
	#map {
		height: 100vh;
		/* position: fixed; */
		z-index: 1;
	}
	#controls {
		display: flex;
		flex-direction: row;
		position: absolute;
		bottom: 0;
		left: calc(50% - (50% / 2));
		width: 50%;
		height: fit-content;
		background-color: var(--color-bg-1);
		z-index: 2;
		margin: 1em 0;
		padding: 0.5em;
		gap: 1em;
		border-radius: 4%;
		opacity: 0.8;
	}

	@media (max-width: 500px) {
		#controls {
			width: 70%;
			left: calc(50% - (70% / 2));
		}
	}

	#controls .content {
		width: 100%;
	}

	#controls .i {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content .info {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
	}

	.content .info .info-line {
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
	}

	.info-line pre {
		text-wrap: wrap;
		text-overflow: ellipsis;
		text-align: right;
		overflow: hidden;
	}
</style>
