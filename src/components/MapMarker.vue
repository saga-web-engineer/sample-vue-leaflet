<script setup lang="ts">
import { LIcon, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import type { PointTuple } from 'leaflet';

import Logo from '@/assets/logo.svg';

const markerLatLng: PointTuple = [33.1504684, 130.3031056];
const iconSize: PointTuple = [35, 30];
const popupAnchor: PointTuple = [0, -12];
</script>

<template>
  <l-marker :lat-lng="markerLatLng">
    <l-icon :icon-url="Logo" :icon-size="iconSize" :popup-anchor="popupAnchor"></l-icon>
    <l-popup>佐賀空港<br />緯度：{{ markerLatLng[0] }}<br />経度：{{ markerLatLng[1] }}</l-popup>
  </l-marker>
</template>
