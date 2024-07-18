// 地图相关配置
export const config = {
    url: {
        xyzUrls: [
            'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
            'http://t3.tianditu.com/DataServer?T=img_w&tk=106f4215b69d22e0409ac6ea4fbc5b5f&x={x}&y={y}&l={z}',
            'http://t4.tianditu.com/DataServer?T=cva_w&tk=106f4215b69d22e0409ac6ea4fbc5b5f&x={x}&y={y}&l={z}'
        ]
    },
    center: [113.728361, 22.28002], // 默认中心点
    zoom: 10, // 默认缩放等级
    maxZoom: 20, // 最大缩放等级
    minZoom: 5, // 最小缩放等级
    projection: 'EPSG:4326', // 坐标系规则
    extent: [], // 边界值
}