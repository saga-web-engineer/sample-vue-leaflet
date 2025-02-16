<script setup lang="ts">
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import type { PointExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ref } from 'vue';

const center = ref<PointExpression>([33.2641808, 130.2948219]);
const zoom = ref(12);
const mapUrl = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const mapOptions = {
  attributionControl: false,
};
</script>

<template>
  <l-map :zoom="zoom" :center="center" :use-global-leaflet="false" :options="mapOptions">
    <l-tile-layer :url="mapUrl"></l-tile-layer>
  </l-map>
</template>

<style lang="scss" scoped></style>
