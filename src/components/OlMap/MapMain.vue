<script setup lang="ts">
import { onMounted, type Ref, ref, getCurrentInstance, provide } from 'vue'


import { omap, type IMap } from '@/utils/map'
// const map: Ref<IMap> = ref(null)

// pinia
// import { useStore } from 'pinia'
import { useCounterStore } from '@/stores/counter'
import type BaseLayer from 'ol/layer/Base'
const counter = useCounterStore()
const handleClick = () => {
    // counter.$patch({ count: counter.count + 1 })
    counter.increment()
}
onMounted(() => {
    const mapInstance = omap({
        target: 'ol-map',
    })
    const map = mapInstance.getMap()
    console.log('map', map)
    const layers: BaseLayer[] | undefined = map?.getLayers().getArray()
    console.log(layers)
    // layers[1].setVisible(true)
    // console.log('.......layers[4].getVisible()', layers[4].getVisible())
})

</script>

<template>
    <div id="ol-map" class="ol-map">
        <h1 style="position: absolute; bottom: 50px; right: 50px; color: #fff;z-index: 999;" @click="handleClick">
            {{ counter.count }}</h1>
        <div style="position: absolute;left: 50px;top: 50px;">
            <div>地形图</div>
            <div>影像图</div>
        </div>
    </div>
</template>

<style>
.ol-map {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
}
</style>