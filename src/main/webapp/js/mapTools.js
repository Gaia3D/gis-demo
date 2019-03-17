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
		
	}
};