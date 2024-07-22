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
import OlStyleStyle from 'ol/style/Style'
import OlStyleIcon from 'ol/style/Icon'
import OlStyleText from 'ol/style/Text'
import OlStyleFill from 'ol/style/Fill'
import OlStyleStroke from 'ol/style/Stroke'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import { Fill, RegularShape, Stroke, Style, Circle as CircleStyle, } from 'ol/style.js'

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
    getExtent() {
        const view = this.map?.getView()
        const extent = view?.calculateExtent(this.map?.getSize())
        return extent
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
    // 底图切换
    changeBaseLayer(id: number) {
        const layers = this.getAllLayers()
        const _layers = layers?.filter(_ => _.get('type') === 'base')
        _layers?.map(_ => _.setVisible(false))
        const index: number | undefined = _layers?.findIndex(_ => _.get('id') === id)
        if (typeof index === 'number' && index > -1) {
            if (_layers && _layers.length) {
                const targetLayer = _layers[index]
                targetLayer.setVisible(true)
            }
        }
    }

    // 添加自定义标注
    addCustomSymbols(layerId: string, array: any) {
        if (!layerId) return
        const layer = this.getLayerById('CustomSymbols')
        layer?.getSource().clear()
        if (array && array.length > 0) {
            const features = []
            for (let index = 0; index < array.length; index++) {
                const point = array[index]
                const feature = new OlFeature({
                    geometry: new OlGeomPoint(point),
                    data: {
                        index,
                        point
                    } // 数据存储到 feature 中用来做点击事件
                })
                if (index % 2 === 0) {
                    feature.setStyle(this.setSymbolStyle(index, 'RegularShape', new Fill({ color: 'white' })))
                } else if (index % 7 === 0) {
                    feature.setStyle(this.setSymbolStyle(index, 'CircleStyle', new Fill({ color: 'red' })))
                } else {
                    feature.setStyle(this.setSymbolStyle(index, 'RegularShape', new Fill({ color: 'red' })))
                }
                features.push(feature)
            }
            layer?.getSource().addFeatures(features)
        }
    }
    setSymbolStyle(index: number, type: string, fill: OlStyleFill) {
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
                    // https://openlayers.org/en/latest/examples/regularshape.html
                    image: new RegularShape({
                        fill: fill,
                        stroke: new Stroke({ color: 'black', width: 1 }),
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
