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
		new ol.layer.Tile({
			id: 'osm_layer',
			source: new ol.source.OSM()
	    }),
		// 항공 영상
//		new ol.layer.Tile({
//			id: 'aerial_layer',
//			visible: true,
//			source: new ol.source.TileWMS({
//	    		// url: 'http://localhost:8080/geoserver/gaia3d/wms',
//				url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
//				params: {
//					'FORMAT' : 'image/png',
//					'VERSION' : '1.1.1',
//					'SRS': coordinate,
//					'TILED': true,
//					'LAYERS': [ mapDefaultLayer ]
//				}
//			})
//		}),
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
		}),
		// draw 레이어
		new ol.layer.Vector({
			id: 'draw_layer',
			source: new ol.source.Vector({
				wrapX: true
			})
		})
	];

	// projection 목록
	var projCode = {
		'EPSG:5179': '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
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

	/**
	 * Public
	 */
	return {

		/**
		 * 좌표계 정의
		 */
		projDefs: function() {
			Object.keys(projCode).forEach(function(key){	// 브라우저 호환성 - ie9~, chrome
				proj4.defs(key, projCode[key]);
			});
		},

		/**
		 * 맵 성생
		 */
		create: function(element) {
			// 좌표계 정의
			this.projDefs();

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
		},

		/**
		 * 현재 좌표계 조회
		 * 호출: GAIA3D.GIS.getCurProj()
		 */
		getCurProj: function() {
			return map.getView().getProjection();
		},

		/**
		 * ID를 통해 레이어 찾기
		 * 호출: GAIA3D.GIS.getLayerById('base_layer')
		 */
		getLayerById: function(layerId) {
			var layer = null;
			if(layerId){
				var layers = this.map.getLayers().getArray();
				for(var i in layers){	 // 브라우저 호환성 - ie6~, chrome
					if(layers[i].get('id') === layerId){
						layer = layers[i];
						break;
					}
				}
			}
			return layer;
		},

		/**
		 * WKT로 Feature 그리기
		 */
		getFeatureFromWkt: function(wkt) {
			var format = new ol.format.WKT();
			var feature = format.readFeature(wkt, {
				dataProjection: 'EPSG:4326',
				featureProjection: this.getCurProj()
			});
			return feature;
		},

		/**
		 * Box(네 점의 좌표)로 Feature 그리기
		 */
		getFeatureFromBox: function(box) {
			var coord = this.getPolygonFromBox(box);
			var transCoord = this.transCoord4326ToCurProj(coord);
			var feature = this.getFeatureFromCoord('Polygon', transCoord);
			return feature;
		},

		/**
		 * Box를 Polygon으로 변경
		 */
		getPolygonFromBox: function(box) {
			var polygon = box.split(";");
			polygon.push(polygon[0]);
			return polygon;
		},

		/**
		 * 좌표로 Feature 그리기
		 */
		getFeatureFromCoord: function(geomType, coord) {
			var shape = {
				'Point': new ol.geom.Point(coord),
				'Polygon': new ol.geom.Polygon([coord])
			}

			var feature = new ol.Feature({
				geometry: shape[geomType]
			});

			return feature;
		},

		/**
		 * 4326 데이터를 현재 좌표계로 변경
		 */
		transCoord4326ToCurProj: function(coordArray) {
			var returnCoord = [];
			for(var i=0, l=coordArray.length; i<l; i++) {
				var coord = coordArray[i].split(",");
				var transCoord = ol.proj.transform(coord, "EPSG:4326", this.getCurProj());
				returnCoord.push(transCoord);
			}
			return returnCoord;
		},

		/**
		 * 레이어에 피쳐 추가 (단일)
		 */
		addFeatureToLayer: function(layerId, feature) {
			var layer = this.getLayerById(layerId);
			layer.getSource().addFeature(feature);
		},

		/**
		 * 레이어에 피쳐 추가 (다중)
		 */
		addFeaturesToLayer: function(layerId, features) {
			var layer = this.getLayerById(layerId);
			layer.getSource().addFeatures(features);
		},

		/**
		 * 선택한 객체 모두 지우기
		 */
		clearFeatureToSelect: function() {
			this.map.getInteractions().forEach(function(interaction) {
				if(interaction instanceof ol.interaction.Select) {
					// Select interaction의 Feature 삭제
					interaction.getFeatures().clear();
				}
			});
		},

		/**
		 * 특정 레이어의 모든 객체 지우기
		 */
		clearFeatureToLayer: function(layerId) {
			var layer = this.getLayerById(layerId);
			layer.getSource().clear();
		},

		/**
		 * 블록의 스타일 지정
		 */
		getBlockStyle: function() {
			var style = new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 0, 0, 1)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 0, 0.5)',
					//lineDash: [10, 10],
					width: 2
				})
			});
			return style;
		}
	}	
};