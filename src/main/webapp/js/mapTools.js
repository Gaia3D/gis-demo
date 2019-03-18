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

	};

	// 지오메트리 그리기
	this.drawGeometry = function(source, type) {
		this.clearDrawGeometry();
		if (type !== 'None') {
			var draw = new ol.interaction.Draw({
				source: source,
				type: type
			});
			map.addInteraction(draw);
		}
	};

	// 그린 지오메트리 삭제
	this.clearDrawGeometry = function() {
		map.getInteractions().forEach(function(interaction) {
			// Draw interaction 삭제
			if(interaction instanceof ol.interaction.Draw) {
				map.removeInteraction(interaction);
			}
		});
	};

};