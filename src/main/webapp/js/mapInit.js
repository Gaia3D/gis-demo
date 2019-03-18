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
	 * 4. control 정의
	 * 5. interaction 정의
	 *
	 * 6. map 정의
	 */

	var layers = [
//		new ol.layer.Tile({
//			id: 'osm_layer',
//			source: new ol.source.OSM()
//	    }),
		// 항공 영상
		new ol.layer.Tile({
			id: 'aerial_layer',
			visible: true,
			source: new ol.source.TileWMS({
	    		// url: 'http://localhost:8080/geoserver/gaia3d/wms',
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
//		new ol.layer.Image({
//			id: 'base_layer',
//			visible: true,
//			source: new ol.source.ImageWMS({
//				url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
//				params: {
//					'VERSION' : '1.1.1',
//					'SRS': coordinate,
//					'TILED': true,
//					'LAYERS': ['작업공간명:레이어명', 'gaia3d:f01000', 'gaia3d:a01000', 'gaia3d:b01000']
//				}
//			})
//		}),
		// 벡터 레이어
		new ol.layer.Vector({
			id: 'block_layer',
			option: 'translate',
			visible: true,
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


	/*** START: control ***/
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
	/*** END: control ***/


	/*** START: interaction ***/
	var selectFilter = false;
    var select = new ol.interaction.Select({
		condition: ol.events.condition.click,
		features: ol.interaction.Select,
		toggleCondition: ol.events.condition.shiftKeyOnly,
		layers: function() {
			// translate를 할 레이어 설정
			var targetLayer = [];
			var option = 'translate';
			var layers = map.getLayers().getArray();
			layers.filter(function(layer, index) {
				if(layer.get('option') === option){
					targetLayer.push(layer);
				}
			});
			return targetLayer;
		},
		filter: function(e, a, b) {
			return selectFilter;
		}
	});

    // 블록 이동
	var translate = new ol.interaction.Translate({
		features: select.getFeatures()
	});

	var mouseWheelZoom = new ol.interaction.MouseWheelZoom({
		duration: 700
	});
	/*** END: interaction ***/


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

    this.getSelect = function() {
    	return select;
    };

    this.setTranslate = function(status) {
    	var boolean = status === 'on' ? true : false;
    	selectFilter = boolean;
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

		//map.addControls(mousePositionControl);
		map.addInteraction(select);
		map.addInteraction(translate);
		map.addInteraction(mouseWheelZoom);

		return map;
	};
};