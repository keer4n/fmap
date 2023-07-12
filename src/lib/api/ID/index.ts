export const STOCKING_URL = 'https://idfg.idaho.gov/ifwis/fishingplanner/api/2.0/stocking/';

export interface IDStockingResponse {
	response: string;
	msg: string;
	total: number;
	rows?: RowsEntity[] | null;
}
export interface RowsEntity {
	id: string;
	name: string;
	var?: string | null;
	loc?: string | null;
	trib: string;
	rfw: number;
	ffw: number;
	n: string;
	spp: string;
	len: string;
	stocked: string;
}

export interface GeoJSON {
	type: string;
	features?: FeaturesEntity[] | null;
}
export interface FeaturesEntity {
	type: string;
	geometry: Geometry;
	properties: Properties;
}
export interface Geometry {
	type: string;
	coordinates?: (number[] | null)[] | null;
}
export interface Properties {
	NAME: string;
}

const OpportunityType = {
	RECOMMENDED_FISHING_WATERS: 1,
	FAMILY_FISHING_WATERS: 2
} as const;
const County = {
	ADA: 1
} as const;
export async function getStockingRecords() {
	const type = OpportunityType.RECOMMENDED_FISHING_WATERS;
	const county = County.ADA;
	const searchParams = new URLSearchParams({
		search: '',
		sort: 'stocked',
		order: 'desc',
		offset: '0',
		limit: '25',
		body: '',
		type: type.toString(),
		facility: '',
		stock: '',
		game: '',
		region: '',
		county: county.toString(),
		town: ''
	});
	const url = STOCKING_URL + '?' + searchParams.toString();
	const response = await fetch('https://cors.keer4n.workers.dev/?link=' + encodeURIComponent(url));
	const stockingRecords = await response.json();
	return stockingRecords as IDStockingResponse;
}

export async function getGeoJson(id: number) {
	const serverNo: 0 | 1 = 1;
	const baseUrl = `https://gisportal-idfg.idaho.gov/hosting/rest/services/Hydrography/Hydrography_Public/MapServer/${serverNo}/query?`;
	const searchParams = new URLSearchParams({
		where: `LLID= '${id}'`,
		text: '',
		objectIds: '',
		time: '',
		timeRelation: 'esriTimeRelationOverlaps',
		geometry: '',
		geometryType: 'esriGeometryEnvelope',
		inSR: '',
		spatialRel: 'esriSpatialRelIntersects',
		distance: '',
		units: 'esriSRUnit_Foot',
		relationParam: '',
		outFields: '',
		returnGeometry: 'true',
		returnTrueCurves: 'false',
		maxAllowableOffset: '',
		geometryPrecision: '',
		outSR: '',
		havingClause: '',
		returnIdsOnly: 'false',
		returnCountOnly: 'false',
		orderByFields: '',
		groupByFieldsForStatistics: '',
		outStatistics: '',
		returnZ: 'false',
		returnM: 'false',
		gdbVersion: '',
		historicMoment: '',
		returnDistinctValues: 'false',
		resultOffset: '',
		resultRecordCount: '',
		returnExtentOnly: 'false',
		sqlFormat: 'none',
		datumTransformation: '',
		parameterValues: '',
		rangeValues: '',
		quantizationParameters: '',
		featureEncoding: 'esriDefault',
		f: 'geojson'
	});
	const url = baseUrl + searchParams.toString();
	const response = await fetch(url);
	const geoJson = await response.json();
	console.log('geojson', geoJson);
	return geoJson as GeoJSON;
}
