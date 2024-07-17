<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import { omap, type IMap } from '@/utils/map'
const map: Ref<IMap> = ref(null)

onMounted(() => {
    const mapInstance = omap({
        target: 'ol-map',
    })
    map['value'] = mapInstance.getMap()
    console.log('map', map)
    // const map = new Map({
    //     layers: [
    //         new TileLayer({
    //             // 天地图影像图
    //             source: new XYZ({
    //                 url:
    //                     "http://t3.tianditu.com/DataServer?T=img_w&tk=106f4215b69d22e0409ac6ea4fbc5b5f&x={x}&y={y}&l={z}"
    //             })

    //             // 天地图地形图
    //             // source: new XYZ({
    //             //     url:
    //             //         "http://t4.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=106f4215b69d22e0409ac6ea4fbc5b5f"
    //             // })

    //             // 天地图标注
    //             // source: new XYZ({
    //             //     url:
    //             //         "http://t4.tianditu.com/DataServer?T=cva_w&tk=106f4215b69d22e0409ac6ea4fbc5b5f&x={x}&y={y}&l={z}"
    //             // })

    //             // 天地图底图
    //             // source: new XYZ({
    //             //     url:
    //             //         "http://t4.tianditu.com/DataServer?T=vec_w&tk=106f4215b69d22e0409ac6ea4fbc5b5f&x={x}&y={y}&l={z}"
    //             // })

    //             // 高德地图
    //             // source: new XYZ({
    //             //     url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    //             // })

    //             // 高德地图影像图
    //             // source: new XYZ({
    //             //     url: 'http://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
    //             // })

    //             // source: new XYZ({
    //             //     url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    //             //     crossOrigin: "anonymous",
    //             // })
    //         }),
    //         new TileLayer({
    //             // 高德地图路网标记
    //             source: new XYZ({
    //                 url: 'http://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}'
    //             })
    //         })
    //     ],
    //     target: 'ol-map',
    //     view: new View({
    //         projection: 'EPSG:4326',
    //         center: [116.395645038, 39.9299857781],
    //         zoom: 12,
    //     }),
    // })
    // console.log(map)
})


</script>

<template>
    <div id="ol-map" class="ol-map">

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