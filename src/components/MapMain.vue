<script setup lang="ts">
import { LControlScale, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import type { PointTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const mapInstance = ref<L.Map | null>(null);
// 佐賀駅を初期中心座標
const initCenter = ref<PointTuple>([33.2641808, 130.2948219]);
const center = ref<PointTuple>([initCenter.value[0], initCenter.value[1]]);
const zoom = ref(12);
const mapUrl = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const mapOptions = {
  attributionControl: false,
};

const updateZoom = (currentZoom: number) => (zoom.value = currentZoom);
const updateCenter = (_center: { lat: number; lng: number }) =>
  (center.value = [_center.lat, _center.lng]);

const onMapReady = (map: L.Map) => {
  mapInstance.value = map;
  mapInstance.value.setView(center.value, zoom.value);
};

onMounted(() => {
  if (route.query.zoom) updateZoom(Number(route.query.zoom));
  if (route.query.lat && route.query.lng) {
    center.value = [Number(route.query.lat), Number(route.query.lng)];
  }
});

// ズームレベルが変更されたらパラメータ付与
watch(zoom, () => {
  router.replace({
    query: {
      ...route.query,
      zoom: zoom.value,
    },
  });
});

// 中心座標が変更されたらパラメータ付与
watch(center, () => {
  router.replace({
    query: {
      ...route.query,
      lat: center.value[0],
      lng: center.value[1],
    },
  });
});
</script>

<template>
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
    <l-control-scale position="bottomright" :imperial="false" :metric="true"></l-control-scale>
  </l-map>
</template>

<style lang="scss" scoped></style>
