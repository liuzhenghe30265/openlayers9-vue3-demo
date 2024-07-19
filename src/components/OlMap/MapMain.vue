<script setup lang="ts">
import { onMounted, type Ref, ref, shallowRef, getCurrentInstance, provide } from 'vue'

import { omap, type IMap } from '@/utils/map'
const map: Ref<IMap> = shallowRef(null)

// pinia
// import { useStore } from 'pinia'
import { useCounterStore } from '@/stores/counter'
import type BaseLayer from 'ol/layer/Base'
const counter = useCounterStore()
const handleClick = () => {
    // counter.$patch({ count: counter.count + 1 })
    counter.increment()
}
const currentBaseLayer = ref(1)
onMounted(() => {
    const mapInstance = omap({
        target: 'ol-map',
    })
    map['value'] = mapInstance.getMap()
    console.log('map', map)
    const layers: BaseLayer[] | undefined = map.value?.getLayers().getArray()
    console.log(layers)
})

const handleChangeBaseLayer = (id: number) => {
    const layers: BaseLayer[] | undefined = map.value?.getLayers().getArray()
    layers?.map(_ => _.setVisible(false))
    const index: number | undefined = layers?.findIndex(_ => _.get('id') === id)
    if (index && index > -1) {
        if (layers && layers.length) {
            const targetLayer = layers[index]
            targetLayer.setVisible(true)
            currentBaseLayer.value = id
        }
    }
}

</script>

<template>
    <div id="ol-map" class="ol-map">
        <!-- <h1 style="position: absolute; bottom: 50px; right: 50px; color: #fff;z-index: 999;" @click="handleClick">
            {{ counter.count }}</h1> -->
        <div class="nav_control">
            <div class="btn" @click="handleChangeBaseLayer(1)" :class="{ active: currentBaseLayer === 1 }">矢量地图</div>
            <div class="btn" @click="handleChangeBaseLayer(2)" :class="{ active: currentBaseLayer === 2 }">卫星影像图</div>
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

.nav_control {
    position: absolute;
    left: 50px;
    top: 50px;
    z-index: 999;
    background-color: #fff;
    color: #333;
    font-size: 24px;
}

.nav_control .btn {
    cursor: pointer;
}

.nav_control .btn.active {
    color: red;
}
</style>