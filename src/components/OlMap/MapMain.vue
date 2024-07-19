<script setup lang="ts">
import * as turf from '@turf/turf'
import { onMounted, type Ref, ref, shallowRef, getCurrentInstance, provide } from 'vue'
import { omap, type IMap } from '@/utils/map'
import { useCounterStore } from '@/stores/counter'
import type BaseLayer from 'ol/layer/Base'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import OlLayerVector from 'ol/layer/Vector'
import OlSourceVector from 'ol/source/Vector'
import OlStyleStyle from 'ol/style/Style'
import OlStyleIcon from 'ol/style/Icon'
import OlStyleText from 'ol/style/Text'
import OlStyleFill from 'ol/style/Fill'
import OlStyleStroke from 'ol/style/Stroke'
import { Fill, RegularShape, Stroke, Style, Circle as CircleStyle, } from 'ol/style.js'

const map: Ref<IMap> = shallowRef(null)
const currentBaseLayer = ref(1)
const marked = ref(true)

onMounted(() => {
    initMap()
})

// 底图切换
const handleChangeBaseLayer = (id: number) => {
    const layers: BaseLayer[] | undefined = map.value?.getLayers().getArray()
    const _layers = layers?.filter(_ => _.get('type') === 'base')
    _layers?.map(_ => _.setVisible(false))
    const index: number | undefined = _layers?.findIndex(_ => _.get('id') === id)
    if (typeof index === 'number' && index > -1) {
        if (_layers && _layers.length) {
            const targetLayer = _layers[index]
            targetLayer.setVisible(true)
            currentBaseLayer.value = id
        }
    }
}

// 标注
// import icon from '@/assets/images/ico01.png'
const stroke = new Stroke({ color: 'black', width: 1 })
// const fill = new Fill({ color: 'red' })
const setSymbolStyle = (index: number, type: string, fill: OlStyleFill) => {
    const Styles = []
    if (type === 'RegularShape') {
        Styles.push(
            new OlStyleStyle({
                // 设置图标
                // image: new OlStyleIcon({
                //     src: icon,
                //     anchor: [0.5, 1],
                //     scale: 0.4
                // }),
                image: new RegularShape({
                    fill: fill,
                    stroke: stroke,
                    points: 3,
                    radius: 6,
                    rotation: Math.PI / 4,
                    angle: Math.floor(Math.random() * (359)) + 1,
                })
                // 设置图片下面显示字体的样式和内容
                // text: new OlStyleText({
                //     font: '14px sans-serif', // 设置字体
                //     maxAngle: 30,
                //     offsetX: 10, // 设置文字偏移量
                //     offsetY: 10,
                //     text: text, // 文字描述
                //     fill: new OlStyleFill({
                //         // 字体颜色
                //         color: '#000'
                //     }),
                //     stroke: new OlStyleStroke({
                //         // 文字描边
                //         color: '#fff',
                //         width: 5
                //     })
                // })
            })
        )
    } else if (type === 'CircleStyle') {
        Styles.push(
            new OlStyleStyle({
                image: new CircleStyle({
                    radius: 6, // 圆的半径
                    fill: new Fill({
                        color: 'red', // 填充颜色
                    }),
                    stroke: new Stroke({
                        color: 'black', // 圆边框颜色
                        width: 1,
                    }),
                })
            })
        )
    }

    return Styles
}
const handleMark = () => {
    const layer = getLayerById('CustomSymbols')
    marked.value = !marked.value
    if (marked.value) {
        layer?.getSource().clear()
        return
    }
    const view = map.value?.getView()
    const bbox = view?.calculateExtent(map.value?.getSize())
    const positions = turf
        .randomPoint(1000, {
            bbox: bbox
        })
        .features.map(_ => {
            return _.geometry.coordinates
        })

    layer?.getSource().clear()

    const features = []
    for (let index = 0; index < positions.length; index++) {
        const point = positions[index]
        const feature = new OlFeature({
            geometry: new OlGeomPoint(point),
            data: {
                index,
                point
            } // 数据存储到 feature 中用来做点击事件
        })
        if (index % 2 === 0) {
            feature.setStyle(setSymbolStyle(index, 'RegularShape', new Fill({ color: 'white' })))
        } else if (index % 7 === 0) {
            feature.setStyle(setSymbolStyle(index, 'CircleStyle', new Fill({ color: 'red' })))
        } else {
            feature.setStyle(setSymbolStyle(index, 'RegularShape', new Fill({ color: 'red' })))
        }
        features.push(feature)
    }
    layer?.getSource().addFeatures(features)
}

// 初始化地图
const initMap = () => {
    const mapInstance = omap({
        target: 'ol-map',
    })
    map['value'] = mapInstance.getMap()
    console.log('map', map)
    const layers = getAllLayers()

    // 添加矢量标注图层
    const vectorLayer = new OlLayerVector({
        id: 'CustomSymbols',
        source: new OlSourceVector(),
        zIndex: 999,
    })
    map.value?.addLayer(vectorLayer)
    console.log(layers)
}

// 根据 id 获取图层
const getLayerById = (id: string | number) => {
    const layers = getAllLayers()
    const layer = layers?.find(_ => _.get('id') === 'CustomSymbols')
    return layer
}

// 获取所有图层
const getAllLayers = () => {
    const layers: BaseLayer[] | undefined = map.value?.getLayers().getArray()
    return layers
}

const counter = useCounterStore()
const handleClick = () => {
    // counter.$patch({ count: counter.count + 1 })
    counter.increment()
}
</script>

<template>
    <div id="ol-map" class="ol-map">
        <!-- <h1 style="position: absolute; bottom: 50px; right: 50px; color: #fff;z-index: 999;" @click="handleClick">
            {{ counter.count }}</h1> -->
        <div class="nav_control">
            <div class="btn" @click="handleChangeBaseLayer(1)" :class="{ active: currentBaseLayer === 1 }">矢量地图</div>
            <div class="btn" @click="handleChangeBaseLayer(2)" :class="{ active: currentBaseLayer === 2 }">卫星影像图</div>
            <hr>
            <div class="btn" @click="handleMark">水上目标</div>
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