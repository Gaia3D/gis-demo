var MapInit = function(mapConfig) {

	if (!(this instanceof MapInit)) {
		throw new Error('New 를 통해 생성 하십시오.');
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
	 * 6. overlay 정의
	 *
	 * 7. map 정의
	 */

	var layers = [
		new ol.layer.Tile({
			// https://openlayers.org/en/master/examples/reprojection.html
			source: new ol.source.OSM()
		}),
		// 항공 영상
		/*
		new ol.layer.Tile({
			id: 'aerial_layer',
			visible: true,
			source: new ol.source.TileWMS({
	    		// url: 'http://localhost:8080/geoserver/demo/wms',
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
		*/
		// shp 레이어
		
		new ol.layer.Image({
			id: 'wms_layer',
			visible: false,
			source: new ol.source.ImageWMS({
				url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
				params: {
					'VERSION' : '1.1.1',
					'SRS': coordinate,
					'TILED': true,
					'LAYERS': ['demo:edge_data']	//'demo:emd',
				}
			})
		}),

		new ol.layer.Image({
			id: 'network_layer',
			visible: false,
			source: new ol.source.ImageWMS({
				url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
				params: {
					'VERSION' : '1.1.1',
					'SRS': coordinate,
					'TILED': true,
					'LAYERS': ['demo:pgr_fromAtoB']	//'demo:emd',
				}
			})
		}),
		
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
		}),
		// point 레이어
		new ol.layer.Vector({
			id: 'point_layer',
			visible: true,
			source: new ol.source.Vector({
				features: new ol.Collection()
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
		zoom: 12,
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


    var tooltipOverlay = new ol.Overlay({
        id: 'tooltip-overlay',
        element: document.getElementById('tooltip'),
        autoPan: true,
    	autoPanAnimation: {
    		duration: 250
    	},
        offset: [10, 0],
        positioning: 'bottom-left'
    });

    var popupOverlay = new ol.Overlay({
    	id: 'popup-overlay',
    	element: document.getElementById('popup'),
    	autoPan: true,
    	autoPanAnimation: {
    		duration: 250
    	},
    	offset: [10, 10],
    	positioning: 'top'
    });

	// 지도객체
	var map;

	/**
	 * Public
	 */
	return {

		layerState: {
			building: false
		},

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
			var gisMethod = this;

			// 좌표계 정의
			gisMethod.projDefs();

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
				overlays: [tooltipOverlay, popupOverlay],
				layers: layers,
				view: view,
				target: element
			});

			//map.addControls(mousePositionControl);
			map.addInteraction(select);
			map.addInteraction(translate);
			map.addInteraction(mouseWheelZoom);
			map.on('singleclick', function(event){
				if (event.dragging) return;

				// 건물 버튼 on
				var onBuildingLayer = GAIA3D.GIS.layerState.building;
				if(onBuildingLayer) {
					gisMethod.getGeoInfo(event);
				}

				// 팝업 on
				gisMethod.toggleOverlay(event);
			});

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
				var layers = map.getLayers().getArray();
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
			var polygon = box.split(';');
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
		 * 지도의 줌 레벨을 변경
		 */
		setZoom: function(direction) {
			var zoom = 0;
			var zoomFactor = 1;
			var currentZoom = view.getZoom();
			if(direction === 'in') {
				zoom = currentZoom + zoomFactor;
			} else if(direction === 'out') {
				zoom = currentZoom - zoomFactor;
			}

			view.animate({
				zoom: zoom,
				duration: 700
			});
		},

		/**
		 * 지도를 회전
		 */
		setRotate: function(direction) {
			var rotation = 0;
			if(direction === 'left') {
				rotation = view.getRotation() + Math.PI/2
			} else if(direction === 'right') {
				rotation = view.getRotation() - Math.PI/2
			}

			view.animate({
				rotation: rotation
			});
		},

		/**
		 * 블록 객체를 이동
		 */
		setTranslate: function(status) {
			var boolean = status === 'on' ? true : false;
			selectFilter = boolean;
		},

		/**
		 * 4326 데이터를 현재 좌표계로 변경
		 */
		transCoord4326ToCurProj: function(coordArray) {
			var returnCoord = [];
			for(var i=0, l=coordArray.length; i<l; i++) {
				var coord = coordArray[i].split(',');
				var transCoord = ol.proj.transform(coord, 'EPSG:4326', this.getCurProj());
				returnCoord.push(transCoord);
			}
			return returnCoord;
		},

		/**
		 * 그리기 객체 추가
		 */
		drawGeometry: function(source, type) {
			// 활성화 된 draw가 있으면 삭제하고
			this.clearDrawInteraction();

			if (type !== 'None') {
				var draw = new ol.interaction.Draw({
					source: source,
					type: type
				});
				// 맵에 interaction 추가
				map.addInteraction(draw);
			}
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
			map.getInteractions().forEach(function(interaction) {
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
		 * 활성화 된 interaction 삭제
		 */
		clearDrawInteraction: function() {
			map.getInteractions().forEach(function(interaction) {
				// Draw interaction 삭제
				if(interaction instanceof ol.interaction.Draw) {
					map.removeInteraction(interaction);
				}
			});
		},

		/**
		 * 객체의 정보를 취득
		 */
		getGeoInfo: function(event) {
			var layer = this.getLayerById('wms_layer');
			if(layer) {
				var viewResolution = map.getView().getResolution();
				var targetLayer = 'demo:building';	// 없으면 all
				var url = layer.getSource().getGetFeatureInfoUrl(
					event.coordinate,
					viewResolution,
					this.getCurProj().getCode(),
					{'INFO_FORMAT': 'application/json', 'X': 50, 'Y': 50, 'FEATURE_COUNT': 50, 'QUERY_LAYERS': targetLayer}
				);
				if (url) {
					$.ajax({
						url: url,
						headers: {'X-Requested-With': 'XMLHttpRequest'},
						type: 'get',
						dataType: 'json',
						success: function(res) {
							var features = res.features;
							if(features.length > 0){
								for(var i=0,len=features.length; i<len; i++) {
									alert(features[i].id);
								}
							}
						},
						error: function(request, status, error) {
							debugger
						}
					});
				}
			}
		},

		/**
		 * 팝업 on/off
		 */
		toggleOverlay: function(event) {

		}
	}
};