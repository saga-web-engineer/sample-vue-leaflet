<script setup lang="ts">
import { kml } from '@tmcw/togeojson';
import { LControlScale, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import type { PointTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import MapMarker from '@/components/MapMarker.vue';

const route = useRoute();
const router = useRouter();

const mapInstance = ref<L.Map | null>(null);
// 佐賀駅を初期中心座標
const center = ref<PointTuple>([33.2641808, 130.2948219]);
const zoom = ref(12);
const mapUrl = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const mapOptions = {
  attributionControl: false,
};
const geoJsonData = ref<FeatureCollection<Geometry | null, GeoJsonProperties> | null>(null);

const updateZoom = (currentZoom: number) => (zoom.value = currentZoom);
const updateCenter = (currentCenter: { lat: number; lng: number }) =>
  (center.value = [currentCenter.lat, currentCenter.lng]);

const onMapReady = (map: L.Map) => {
  mapInstance.value = map;
  mapInstance.value.setView(center.value, zoom.value);
};

const handleFileDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files[0];
  if (!file) return;
  const reader = new FileReader();
  const parser = new DOMParser();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    const kmlContent = e.target?.result;
    if (typeof kmlContent === 'string') {
      const kmlDocument = parser.parseFromString(kmlContent, 'text/xml');
      const geoJson = kml(kmlDocument);
      const newGeoJsonData: FeatureCollection<Geometry | null, GeoJsonProperties> = {
        type: 'FeatureCollection',
        features: [...(geoJsonData.value?.features || []), ...geoJson.features],
      };

      geoJsonData.value = newGeoJsonData;
    }
  };

  reader.readAsText(file);
};

onMounted(() => {
  if (route.query.zoom) updateZoom(Number(route.query.zoom));
  if (route.query.lat && route.query.lng) {
    center.value = [Number(route.query.lat), Number(route.query.lng)];
  }
});

// ズームレベル、中心座標が変更されたらパラメータ付与
watch([zoom, center], () => {
  router.replace({
    query: {
      ...route.query,
      zoom: zoom.value,
      lat: center.value[0],
      lng: center.value[1],
    },
  });
});
</script>

<template>
  <div class="w-100 h-100" draggable="true" @dragover.prevent @drop.stop.prevent="handleFileDrop">
    <l-map
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      :options="mapOptions"
      @ready="onMapReady"
      @update:zoom="updateZoom"
      @update:center="updateCenter"
    >
      <l-tile-layer :url="mapUrl"></l-tile-layer>
      <MapMarker />
      <l-control-scale position="bottomright" :imperial="false" :metric="true"></l-control-scale>
    </l-map>
  </div>
</template>

<style lang="scss" scoped></style>
