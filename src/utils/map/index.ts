import { config } from './config'
import 'ol/ol.css'
import Map, { type MapOptions } from 'ol/Map.js'
import View from 'ol/View.js'
import TileLayer from 'ol/layer/Tile.js'
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
}

export const omap = (opts: MapOptions) => {
    const layers =
        opts.layers ||
        config.baseLayer.map(_ => {
            if (_.type === 'xyz') {
                // return new LayerGroup({
                //     layers: [

                //     ]
                // })
                return new TileLayer({
                    title: _.name,
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
