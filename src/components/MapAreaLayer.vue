<script setup lang="ts">
import { LGeoJson } from '@vue-leaflet/vue-leaflet';
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import type { ImageOverlay, PathOptions } from 'leaflet';

defineProps<{
  geoJsonData: FeatureCollection<Geometry | null, GeoJsonProperties> | null;
}>();

// GeoJSONから値を取得
const setFeatureStyle = (feature: Feature<Geometry, GeoJsonProperties> | null): PathOptions => ({
  fillColor: feature?.properties?.fill ?? '#3388ff',
  fillOpacity: feature?.properties?.['fill-opacity'] ?? 0.2,
  weight: feature?.properties?.['stroke-width'] ?? 3,
  color: feature?.properties?.stroke ?? '#3388ff',
});

// 取得した値を適用
const geoJsonOptions = {
  onEachFeature: (feature: Feature<Geometry, GeoJsonProperties> | null, layer: ImageOverlay) => {
    // マーカー以外のものにスタイルを当てる
    if (feature?.geometry?.type !== 'Point') layer.setStyle(setFeatureStyle(feature));

    // 名前をツールチップとして表示させる
    if (feature?.properties?.name) {
      layer.bindTooltip(feature.properties.name, {
        permanent: true,
        direction: 'center',
        className: 'tooltip',
      });
    }
  },
};
</script>

<template>
  <l-geo-json v-if="geoJsonData" :geojson="geoJsonData" :options="geoJsonOptions"></l-geo-json>
</template>
