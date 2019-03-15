(function() {
	// 지도 확대/축소
	$('.zoom').on('click', function() {
		var direction = $(this).data('direction');
		GAIA3D.Tools.setZoom(direction);
	});

	// 지도 회전(좌/우)
	$('.rotate').on('click', function() {
		var direction = $(this).data('direction');
		GAIA3D.Tools.setRotate(direction);
	});

	// 블록 조회
	$('.search').on('click', function() {
		var type = $(this).data('type');
		$.ajax({
			url: GAIA3D.Policy.serverUrl + '/block',
			data: {blockType: type},
			dataType: 'json',
			type: 'post',
			success: function(res) {
				debugger;
			},
			error: function(e) {
				debugger;
			}
		})
	});

	// 블록 지우기

	// 블록 이동
})();
