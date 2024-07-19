import { config } from './config'
import 'ol/ol.css'
import Map, { type MapOptions } from 'ol/Map.js'
import View from 'ol/View.js'
import TileLayer from 'ol/layer/Tile.js'
import OlLayerVector from 'ol/layer/Vector'
import OlSourceVector from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ.js'
import { Group as LayerGroup } from 'ol/layer.js'
import {
    defaults as Defaults,
    MousePosition,
    ScaleLine,
    ZoomSlider,
    FullScreen
} from 'ol/control'

export type IMap = Map | null

class OMap {
    map: IMap = null
    constructor(opts: MapOptions) {
        this.init(opts)
    }
    private init(opts: MapOptions) {
        this.map = new Map(opts)
    }
    getMap() {
        return this.map
    }
    // 获取所有图层
    getAllLayers() {
        return this.map?.getLayers().getArray()
    }
    // 根据 id 获取图层
    getLayerById(id: string | number) {
        const layers = this.getAllLayers()
        const layer = layers?.find(_ => _.get('id') === id)
        return layer
    }
    // 添加矢量标注图层
    addVectorLayer(id: string | number) {
        const vectorLayer = new OlLayerVector({
            id: id,
            source: new OlSourceVector(),
            zIndex: 999,
        })
        this.map?.addLayer(vectorLayer)
    }
    addOlFeature() {
        
    }
    // 添加地图事件
    addEventHandler() {
        this.map?.on('singleclick', event => {
            console.log(event)
            const feature = this.map?.forEachFeatureAtPixel(
                event.pixel,
                // eslint-disable-next-line no-unused-vars
                (feature, layer) => {
                    return feature
                }
            )
            console.log(feature)
            if (feature) {
                // 点击到标注
                const symbolData = feature.get('data')
                console.log(symbolData)
            }
        })
    }
}

export const omap = (opts: MapOptions) => {
    const layers =
        opts.layers ||
        config.baseLayer.map(_ => {
            if (_.source === 'xyz') {
                // return new LayerGroup({
                //     layers: [

                //     ]
                // })
                return new TileLayer({
                    title: _.name,
                    type: _.type,
                    id: _.id,
                    source: new XYZ({
                        url: _.url,
                    }),
                    visible: _.visible
                })
            }
        })
    const controls =
        opts.controls ||
        Defaults({ zoom: true }).extend([
            new ScaleLine(), // 比例尺控件
            new ZoomSlider(), // 缩放滑块刻度控件
            new FullScreen(), // 全屏控件
            // new MousePosition({
            //     coordinateFormat: function (coordinate) {
            //         return `东经${coordinate?.[0]} 北纬${coordinate?.[1]}`
            //     }
            // }) // 鼠标位置控件
        ])

    return new OMap(
        Object.assign(
            {
                layers,
                controls,
                target: opts.target,
                view:
                    opts.view ||
                    new View({
                        projection: config.projection,
                        center: config.center,
                        zoom: config.zoom,
                        maxZoom: config.maxZoom,
                        minZoom: config.minZoom
                    })
            },
            opts
        )
    )
}


omap.prototype = OMap.prototype
