// 地图相关配置
export const config = {
    url: {
        xyzUrls: [
            'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
        ]
    },
    center: [113.728361, 22.28002], // 默认中心点
    zoom: 10, // 默认缩放等级
    maxZoom: 20, // 最大缩放等级
    minZoom: 5, // 最小缩放等级
    projection: 'EPSG:4326', // 坐标系规则
    extent: [], // 边界值
}