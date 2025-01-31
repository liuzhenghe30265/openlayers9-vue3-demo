// 地图相关配置
const tk: string = '106f4215b69d22e0409ac6ea4fbc5b5f'
export const config = {
    baseLayer: [
        {
            id: 1,
            source: 'xyz',
            name: '矢量地图',
            type: 'base',
            url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}`,
            visible: true,
        },
        {
            id: 2,
            source: 'xyz',
            name: '天地图影像图',
            type: 'base',
            url: `http://t3.tianditu.com/DataServer?T=img_w&tk=${tk}&x={x}&y={y}&l={z}`,
            visible: false
        },
        {
            id: 3,
            source: 'xyz',
            name: '天地图标注',
            type: '',
            url: `http://t4.tianditu.com/DataServer?T=cva_w&tk=${tk}&x={x}&y={y}&l={z}`,
            visible: true
        },
    ],
    subLayer: [
        {
            source: 'xyz',
            name: '天地图地形图',
            url: `http://t4.tianditu.com/DataServer?T=ter_w&&tk=${tk}x={x}&y={y}&l={z}`,
            visible: false
        },
        {
            source: 'xyz',
            name: '高德地图影像图',
            url: `http://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}`,
            visible: true
        },
        {
            source: 'xyz',
            name: '高德地图路网标记',
            url: `http://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}`,
            visible: true
        },
        {
            source: 'xyz',
            name: 'arcgisonline',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            crossOrigin: 'anonymous',
            visible: false
        }
    ],
    center: [113.728361, 22.28002], // 默认中心点
    zoom: 10, // 默认缩放等级
    maxZoom: 20, // 最大缩放等级
    minZoom: 5, // 最小缩放等级
    projection: 'EPSG:4326', // 坐标系规则
    extent: [], // 边界值
}