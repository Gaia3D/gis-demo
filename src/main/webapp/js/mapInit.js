var MapWrapper = function(mapConfig) {

	if (!(this instanceof MapWrapper)) {
		throw new Error("New 를 통해 생성 하십시오.");
	}

	var geoserverDataUrl = mapConfig.geoserverDataUrl;
	var geoserverDataWorkspace = mapConfig.geoserverDataWorkspace;
	var coordinate = mapConfig.coordinate;
	var mapDefaultLayer = mapConfig.mapDefaultLayer;
	var mapExtent = mapConfig.mapExtent;
	var mapCenter = mapConfig.mapCenter;

	/**
	 * 1. layer 정의
	 * 2. projection 정의
	 * 3. view 정의
	 * 4. map 정의
	 */

	var layers = [
		// 항공 영상
		new ol.layer.Tile({
			id: 'aerial_layer',
			visible: true,
			source: new ol.source.TileWMS({
				url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
				params: {
					'FORMAT' : 'image/png',
					'VERSION' : '1.1.1',
					'SRS': coordinate,
					'TILED': true,
					'LAYERS': [ mapDefaultLayer ]
				}
			})
		}),
		// shp 파일
		new ol.layer.Image({
			id: 'base_layer',
			visible: true,
			source: new ol.source.ImageWMS({
				url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
				params: {
					'VERSION' : '1.1.1',
					'SRS': coordinate,
					'TILED': true,
					'LAYERS': ['hmd:ldreg', 'hmd:f01000', 'hmd:a01000', 'hmd:b01000']
				}
			})
		}),
		// 벡터 레이어
		new ol.layer.Vector({
			id: 'block_layer',
			visible: false,
			source: new ol.source.Vector({
				features: new ol.Collection()
			})
		})
	];

	// projection 목록
	var projCode = {
		'EPSG:5187': '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	};

	var proj = new ol.proj.Projection({
		code: coordinate,
		units: 'm',
		global: false,
		extent: mapExtent
	});

	var view = new ol.View({
		center: mapCenter,
		zoom: 11,
		extent: mapExtent,
		projection : proj
	});

	// 지도객체
	var map;

	// 좌표계 정의
	var projDefs = function() {
		Object.keys(projCode).forEach(function(key){	// 브라우저 호환성 - ie9~, chrome
			proj4.defs(key, projCode[key]);
		});
    };

    this.create = function(element) {
		// 좌표계 정의
        projDefs();

		// 맵 생성
		map = new ol.Map({
			interactions: ol.interaction.defaults({}).extend([]),
			layers: layers,
			view: view,
			target: element
		});
		return map;
	};
};