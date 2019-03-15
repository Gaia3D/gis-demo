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
		}),
		// draw 레이어
		new ol.layer.Vector({
			id: 'draw_layer',
			source: new ol.source.Vector(),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: '#ffcc33',
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#ffcc33'
					})
				})
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


	/** controls을 활용하여 지도 확대/축소 기능 구현 **/
	var zoom = new ol.control.Zoom({
        units: 'metric',
        duration: 700,
        zoomInLabel: '지도 확대',
        zoomOutLabel: '지도 축소',
        target: document.getElementById('zoom')
    });

	var mousePositionControl = new ol.control.MousePosition({
        //coordinateFormat: ol.coordinate.createStringXY(6),	// 소수점 여섯째
		coordinateFormat: function(coordinate) {
            return ol.coordinate.format(coordinate, '{x}, {y}　EPSG:4326', 6);
        },
		projection: ol.proj.get('EPSG:4326'),
		className: 'mousePosition',
		target: document.getElementById('mouse-position'),
		undefinedHTML: ' '
	});

	var mouseWheelZoom = new ol.interaction.MouseWheelZoom({
		duration: 700
	});

    var overlay = new ol.Overlay({
        id: 'tooltip-overlay',
        element: document.getElementById('tooltip'),
        autoPan: true,
    	autoPanAnimation: {
    		duration: 250
    	},
        offset: [10, 0],
        positioning: 'bottom-left'
    });

	// 지도객체
	var map;

	// 좌표계 정의
	var projDefs = function() {
		Object.keys(projCode).forEach(function(key){	// 브라우저 호환성 - ie9~, chrome
			proj4.defs(key, projCode[key]);
		});
    };

    this.getMap = function() {
    	return map;
    };

    this.create = function(element) {
		// 좌표계 정의
        projDefs();

		// 맵 생성
		map = new ol.Map({
	        controls: ol.control.defaults({
	        	attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
	                collapsible: false
	            }), zoom:false, rotate:false
	        }).extend([
	        	mousePositionControl
	        ]),
			interactions: ol.interaction.defaults(),
	        overlays: [overlay],
			layers: layers,
			view: view,
			target: element
		});

		//map.addControls(zoom);
		//map.addControls(mousePositionControl);
		map.addInteraction(mouseWheelZoom);

		return map;
	};
};