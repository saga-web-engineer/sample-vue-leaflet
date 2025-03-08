<script setup lang="ts">
import { kml } from '@tmcw/togeojson';
import { LControlScale, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import type { PointTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import MapAreaLayer from '@/components/MapAreaLayer.vue';
import MapMarker from '@/components/MapMarker.vue';
import { useDialogStore } from '@/stores/dialog';

const route = useRoute();
const router = useRouter();
const dialogStore = useDialogStore();
const { isDialogOpen, message } = storeToRefs(dialogStore);

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
  const fileName = file.name;
  const fileSize = file.size;
  // 今回は10MBで設定
  const MAX_KML_SIZE_MB = 10;
  // 0.1MBで設定したときに小数点を省くため
  const MAX_KML_SIZE_BYTES = Math.trunc(MAX_KML_SIZE_MB * 1024 ** 2);

  // アップロードしたKMLファイルが設定された容量を超えていた場合
  if (fileSize > MAX_KML_SIZE_BYTES) {
    message.value = `ファイルサイズが${MAX_KML_SIZE_MB}MBを超えているためアップロードできません。`;
    isDialogOpen.value = true;
    return;
  }

  reader.onload = (e: ProgressEvent<FileReader>) => {
    const kmlContent = e.target?.result;
    if (typeof kmlContent === 'string') {
      const kmlDocument = parser.parseFromString(kmlContent, 'text/xml');
      const perseError = kmlDocument.querySelector('parsererror');
      // パースできないファイル形式または拡張子が.kmlではなかったら
      if (perseError || !fileName.endsWith('.kml')) {
        message.value = `KMLファイルの解析に失敗しました。`;
        isDialogOpen.value = true;
        return;
      }
      const geoJson = kml(kmlDocument);
      const newGeoJsonData: FeatureCollection<Geometry | null, GeoJsonProperties> = {
        type: 'FeatureCollection',
        features: [...(geoJsonData.value?.features || []), ...geoJson.features],
      };

      geoJsonData.value = newGeoJsonData;
    }
  };

  reader.readAsText(file);
  message.value = 'KMLファイルのアップロードに成功しました。';
  isDialogOpen.value = true;
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
      <MapAreaLayer :geoJsonData="geoJsonData" />
      <l-control-scale position="bottomright" :imperial="false" :metric="true"></l-control-scale>
    </l-map>
  </div>
</template>

<style lang="scss" scoped></style>
