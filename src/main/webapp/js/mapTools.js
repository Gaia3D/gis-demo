function MapTools(map) {

	if (!(this instanceof MapTools)) {
		throw new Error("New 를 통해 생성 하십시오.");
	}

	var map = map;
	var view = map.getView();

	// 지도 확대 축소
	this.setZoom = function(direction) {
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
	};

	// 지도 회전
	this.setRotate = function(direction) {
		var rotation = 0;
		if(direction === 'left') {
			rotation = view.getRotation() + Math.PI/2
		} else if(direction === 'right') {
			rotation = view.getRotation() - Math.PI/2
		}

		view.animate({
			rotation: rotation
		});
	};

	// 측정
	this.measureLine = function(type) {
		var draw; // global so we can remove it later
		var sketch;
		var helpTooltipElement;
		var helpTooltip;
		var measureTooltipElement;
		var measureTooltip;
		var continueLineMsg = '계속해서 선을 그려보세요.';

		var pointerMoveHandler = function(evt) {
			if (evt.dragging) {
	        	return;
			}
	        /** @type {string} */
			var helpMsg = '지도 위를 클릭해주세요.';

			if (sketch) {
				var geom = (sketch.getGeometry());
				if (geom instanceof ol.geom.Polygon) {
					helpMsg = continuePolygonMsg;
				} else if (geom instanceof ol.geom.LineString) {
					helpMsg = continueLineMsg;
				}
	        }

			helpTooltipElement.innerHTML = helpMsg;
			helpTooltip.setPosition(evt.coordinate);

			helpTooltipElement.classList.remove('hidden');
		};

		map.on('pointermove', pointerMoveHandler);
		map.getViewport().addEventListener('mouseout', function() {
			helpTooltipElement.classList.add('hidden');
		});



		var formatLength = function(line) {
			var length = ol.Sphere.getLength(line);
			var output;
		    if (length > 100) {
		    	output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
		    } else {
		    	output = (Math.round(length * 100) / 100) + ' ' + 'm';
		    }
	    	return output;
		};

      function addInteraction() {
        draw = new ol.interaction.Draw({
          source: new ol.source.Vector(),
          type: type,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.5)',
              lineDash: [10, 10],
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
              }),
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              })
            })
          })
        });
        map.addInteraction(draw);

        createMeasureTooltip();
        createHelpTooltip();

        var listener;
        draw.on('drawstart',
            function(evt) {
              // set sketch
              sketch = evt.feature;

              /** @type {ol.Coordinate|undefined} */
              var tooltipCoord = evt.coordinate;

              listener = sketch.getGeometry().on('change', function(evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                  output = formatArea(geom);
                  tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                  output = formatLength(geom);
                  tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
              });
            }, this);

        draw.on('drawend',
            function() {
              measureTooltipElement.className = 'tooltip tooltip-static';
              measureTooltip.setOffset([0, -7]);
              // unset sketch
              sketch = null;
              // unset tooltip so that a new one can be created
              measureTooltipElement = null;
              createMeasureTooltip();
              ol.Observable.unByKey(listener);
            }, this);
      }



  	var draw = new ol.interaction.Draw({
  		source: new ol.source.Vector(),
  		type: type,
  		style: new ol.style.Style({
  			fill: new ol.style.Fill({
  				color: 'rgba(255, 255, 255, 0.2)'
  			}),
  			stroke: new ol.style.Stroke({
  				color: 'rgba(0, 0, 0, 0.5)',
  				lineDash: [10, 10],
  				width: 2
  			}),
  			image: new ol.style.Circle({
  				radius: 5,
  				stroke: new ol.style.Stroke({
  					color: 'rgba(0, 0, 0, 0.7)'
  				}),
  			fill: new ol.style.Fill({
  				color: 'rgba(255, 255, 255, 0.2)'
  				})
  			})
  		})
  	});


      /**
       * Creates a new help tooltip
       */
      function createHelpTooltip() {
        if (helpTooltipElement) {
          helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new ol.Overlay({
          element: helpTooltipElement,
          offset: [15, 0],
          positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
      }


      /**
       * Creates a new measure tooltip
       */
      function createMeasureTooltip() {
        if (measureTooltipElement) {
          measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new ol.Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
      }
	}

	// 측정
	this.measurePolygon = function() {
		var sketch;
		var helpTooltipElement;
		var helpTooltip;
		var measureTooltipElement;
		var measureTooltip;
		var continuePolygonMsg = '계속해서 다각형을 그려보세요.';
		var pointerMoveHandler = function(evt) {
			if (evt.dragging) {
	        	return;
			}
	        /** @type {string} */
			var helpMsg = '지도 위를 클릭해주세요.';

			if (sketch) {
				var geom = (sketch.getGeometry());
				if (geom instanceof ol.geom.Polygon) {
					helpMsg = continuePolygonMsg;
				} else if (geom instanceof ol.geom.LineString) {
					helpMsg = continueLineMsg;
				}
	        }

			helpTooltipElement.innerHTML = helpMsg;
			helpTooltip.setPosition(evt.coordinate);

			helpTooltipElement.classList.remove('hidden');
		};
		map.on('pointermove', pointerMoveHandler);
		map.getViewport().addEventListener('mouseout', function() {
			helpTooltipElement.classList.add('hidden');
		});

		var typeSelect = document.getElementById('type');
		var draw; // global so we can remove it later

		var formatLength = function(line) {
	        var length = ol.Sphere.getLength(line);
	        var output;
	        if (length > 100) {
	          output = (Math.round(length / 1000 * 100) / 100) +
	              ' ' + 'km';
	        } else {
	          output = (Math.round(length * 100) / 100) +
	              ' ' + 'm';
	        }
	        return output;
		};


      /**
       * Format area output.
       * @param {ol.geom.Polygon} polygon The polygon.
       * @return {string} Formatted area.
       */
      var formatArea = function(polygon) {
        var area = ol.Sphere.getArea(polygon);
        var output;
        if (area > 10000) {
          output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
        }
        return output;
      };

      function addInteraction() {
        var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
        draw = new ol.interaction.Draw({
          source: new ol.source.Vector(),
          type: type,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.5)',
              lineDash: [10, 10],
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
              }),
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              })
            })
          })
        });
        map.addInteraction(draw);

        createMeasureTooltip();
        createHelpTooltip();

        var listener;
        draw.on('drawstart',
            function(evt) {
              // set sketch
              sketch = evt.feature;

              /** @type {ol.Coordinate|undefined} */
              var tooltipCoord = evt.coordinate;

              listener = sketch.getGeometry().on('change', function(evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                  output = formatArea(geom);
                  tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                  output = formatLength(geom);
                  tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
              });
            }, this);

        draw.on('drawend',
            function() {
              measureTooltipElement.className = 'tooltip tooltip-static';
              measureTooltip.setOffset([0, -7]);
              // unset sketch
              sketch = null;
              // unset tooltip so that a new one can be created
              measureTooltipElement = null;
              createMeasureTooltip();
              ol.Observable.unByKey(listener);
            }, this);
      }


      /**
       * Creates a new help tooltip
       */
      function createHelpTooltip() {
        if (helpTooltipElement) {
          helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new ol.Overlay({
          element: helpTooltipElement,
          offset: [15, 0],
          positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
      }


      /**
       * Creates a new measure tooltip
       */
      function createMeasureTooltip() {
        if (measureTooltipElement) {
          measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new ol.Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
      }
	}
};