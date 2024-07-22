<script setup lang="ts">
import * as turf from '@turf/turf'
import { onMounted, type Ref, ref, shallowRef, getCurrentInstance, provide } from 'vue'
import { omap, type IMap } from '@/utils/map'

const mapInstance: any = shallowRef(null) // map 实例
const map: Ref<IMap> = shallowRef(null) // map 对象
const currentBaseLayer = ref(1)
const marked = ref(true)

onMounted(() => {
    initMap()
})

// 底图切换
const handleChangeBaseLayer = (id: number) => {
    mapInstance.value.changeBaseLayer(id)
    currentBaseLayer.value = id
}

const handleMark = () => {
    marked.value = !marked.value
    if (marked.value) {
        mapInstance.value.addCustomSymbols('CustomSymbols', [])
        return
    }
    // 随机生成点位
    const extent = mapInstance.value.getExtent()
    const positions = turf
        .randomPoint(1000, {
            bbox: extent
        })
        .features.map(_ => {
            return _.geometry.coordinates
        })
    mapInstance.value.addCustomSymbols('CustomSymbols', positions)
}

// 初始化地图
const initMap = () => {
    mapInstance['value'] = omap({
        target: 'ol-map',
    })
    map['value'] = mapInstance.value.getMap()
    console.log('map', map)

    // 添加矢量标注图层
    mapInstance.value.addVectorLayer('CustomSymbols')

    // 添加地图事件
    mapInstance.value.addEventHandler()

    console.log('getAllLayers', mapInstance.value.getAllLayers())
}

</script>

<template>
    <div id="ol-map" class="ol-map">
        <div class="nav_control">
            <div class="btn" @click="handleChangeBaseLayer(1)" :class="{ active: currentBaseLayer === 1 }">矢量地图</div>
            <div class="btn" @click="handleChangeBaseLayer(2)" :class="{ active: currentBaseLayer === 2 }">卫星影像图</div>
            <hr>
            <div class="btn" @click="handleMark" :class="{ active: !marked }">水上目标</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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

    .btn {
        cursor: pointer;

        &.active {
            color: red;
        }
    }
}
</style>