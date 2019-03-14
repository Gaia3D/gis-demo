var MapTools = function(map) {

	if (!(this instanceof MapTools)) {
		throw new Error("New 를 통해 생성 하십시오.");
	}

	var map = map;
	var view = map.getView();

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
};