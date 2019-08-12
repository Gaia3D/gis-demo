$(document).ready(function() {

	// 지도 확대/축소
	$('.zoom').on('click', function() {
		var direction = $(this).data('direction');
		GAIA3D.GIS.setZoom(direction);
	});

	// 지도 회전(좌/우)
	$('.rotate').on('click', function() {
		var direction = $(this).data('direction');
		GAIA3D.GIS.setRotate(direction);
	});

	// 그리기
	$('.draw').on('click', function() {
		// Point? LineString? Polygon? draw 타입을 확인
		var type = $(this).data('type');

		// 어떤 레이어에 그림을 그리지? 저장된 레이어 id 불러오기
		var layerId = $(this).data('target-layer');
		var layer = GAIA3D.GIS.getLayerById(layerId);

		// 그 레이어의 source를 찾아서
		var source = layer.getSource();

		// draw geometry 함수 호출!
		GAIA3D.GIS.drawGeometry(source, type);
	});

	// 지우기
	$('.clear').on('click', function() {
		// 어떤 레이어를 지우지?
		var type = $(this).data('type');
		var layerId = $(this).data('target-layer');

		GAIA3D.GIS.clearFeatureToLayer(layerId);
		if(type === 'None') {
			GAIA3D.GIS.clearDrawInteraction();
		}
	});

	// 점 추가
	$('.point').on('click', function() {
		var lon = $(this).data('lon');
		var lat = $(this).data('lat');
		var style = $(this).data('style');
		var layerId = $(this).data('target-layer');

		// 좌표
		var coord = [lon, lat];
		var transCoord = ol.proj.transform(coord, 'EPSG:4326', GAIA3D.GIS.getCurProj())
		var feature = GAIA3D.GIS.getFeatureFromCoord('Point', transCoord);
		// 스타일
		feature.setStyle(GAIA3D.Style[style]);
		// 추가
		GAIA3D.GIS.addFeatureToLayer(layerId, feature);
	});

	// 블록 조회
	$('#addBlock').on('click', function() {
		var layerId = $(this).data('target-layer');
		GAIA3D.GIS.clearFeatureToLayer(layerId);

		$.ajax({
			url: GAIA3D.Policy.serverUrl + '/block',
			//data: {},
			dataType: 'json',
			type: 'get',
			success: function(res) {
				addBlock(layerId, res);
			},
			error: function(e) {
				debugger;
			}
		})
	});

	// 블록 지우기
	$('#removeBlock').on('click', function() {
		// select feature
		GAIA3D.GIS.clearFeatureToSelect();

		// block layer clears
		var layerId = $(this).data('target-layer');
		GAIA3D.GIS.clearFeatureToLayer(layerId);
	});

	// 블록 이동
	$('.translate').on('click', function() {
		var changeStatus = ($(this).data('status') === 'on'? 'off' : 'on');

		// status toggle
		$(this).data('status', changeStatus);
		$(this).text($(this).data(changeStatus));
		GAIA3D.GIS.setTranslate(changeStatus);

		// select feature 비활성화
		GAIA3D.GIS.clearFeatureToSelect();
	});

	// 건물 정보 조회
	$('#getInfo').on('click', function() {
		var changeStatus = ($(this).data('status') === 'on'? 'off' : 'on');

		// status toggle
		$(this).data('status', changeStatus);
		$(this).text($(this).data(changeStatus));
		GAIA3D.GIS.layerState.building = (changeStatus === 'on');

		if(changeStatus === 'on') {
			alert('지도 위의 건물을 클릭해보세요.');
		}
	});
});

function addBlock(layerId, res) {
	var feature = null;
	var features = [];
	var style = GAIA3D.GIS.getBlockStyle();

	for(var i in res) {
		feature = null;

		switch(res[i].blockType) {
		case 'geometry':
			feature = GAIA3D.GIS.getFeatureFromWkt(res[i].geom);
			break;
		case 'text':
			feature = GAIA3D.GIS.getFeatureFromBox(res[i].geom);
			break;
		}

		if(feature) {
			feature.setStyle(style);
			features.push(feature);
		}
	}

	// Map에 Features 추가하기
	GAIA3D.GIS.addFeaturesToLayer(layerId, features);
}