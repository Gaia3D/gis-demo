var MapUtils = function(map) {

	if (!(this instanceof MapUtils)) {
		throw new Error("New 를 통해 생성 하십시오.");
	}

	this.map = map;
	this.view = map.getView();
};

MapUtils.prototype = {
	contructor: MapUtils,

	// 현재 좌표계 조회 (HHI.Utils.getCurProj())
	getCurProj: function() {
		return this.view.getProjection();
	},

	// ID를 통해 레이어 찾기 (HHI.Utils.getLayerById('base_layer'))
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
	}
}